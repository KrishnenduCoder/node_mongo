"use strict";

const mongoose = require('mongoose');
const Countries = mongoose.model('Countries');
const config = require('../../config');
const covidAPI = require('../../covidTracker');
const api = require('../../api');
const lib = require('../../lib/app');

/**
 * GET PERCENTAGE RATE
 * @param total
 * @param num
 * @returns {number}
 */
function getStatRate(total, num){
    try{
        return (num*100)/total;
    }
    catch(e){
        return 0;
    }
}

/**
 * GET DATE RANGE FROM CURRENT DATE TO LAST DATE WITH GIVEN RANGE
 * @param range
 * @returns {{dateTo: string, dateFrom: string}}
 */
function getDateRange(range)
{
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var dateTo = yyyy + '-' + mm + '-' + dd;

    var lastDateTimeStamp = new Date().setDate(today.getDate()-range);
    var lastDate = new Date(lastDateTimeStamp);
    dd = String(lastDate.getDate()).padStart(2, '0');
    mm = String(lastDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    yyyy = lastDate.getFullYear();
    var dateFrom = yyyy + '-' + mm + '-' + dd;

    return {
        dateTo: dateTo,
        dateFrom: dateFrom
    };
}

/**
 * GET ALL DATES BETWEEN TWO GIVEN DATES
 * @param startDate
 * @param endDate
 * @returns {[]}
 */
function getDates(startDate, endDate) {
    var dates = [],
        currentDate = startDate,
        addDays = function(days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        };
    while (currentDate <= endDate) {
        dates.push(currentDate);
        currentDate = addDays.call(currentDate, 1);
    }
    return dates;
}

/**
 * FORMAT DATES
 * @param date
 * @param type
 * @returns {null}
 */
function formatDate(date, type = 1){
    let dd = String(date.getDate()).padStart(2, '0');
    let yyyy = date.getFullYear();
    let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    let formattedDate = null;

    let months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    switch(type){
        case 1:
            formattedDate = yyyy + '-' + mm + '-' + dd;
            break;
        case 2:
            formattedDate = dd +' '+months[parseInt(mm)-1];
            break;
    }

    return formattedDate;
}

/**
 * GET GLOBAL COVID-19 SUMMARY BY API
 * @param req
 * @param res
 */
exports.globalSummary = function(req, res){
    var url = covidAPI.worldTotal;
    api.apiResponse(url, function( err, data){
        if(data){
            /* PERCENTAGE RATES */
            let recoveryRate = getStatRate(data.results[0].total_cases, data.results[0].total_recovered);
            let deathRate = getStatRate(data.results[0].total_cases, data.results[0].total_deaths);
            let activeCaseRate = getStatRate(data.results[0].total_cases, data.results[0].total_active_cases);

            let  responseData = {
                total_confirmed: data.results[0].total_cases,
                total_active: data.results[0].total_active_cases,
                total_recovered: data.results[0].total_recovered,
                total_deaths: data.results[0].total_deaths,
                active_cases_rate: activeCaseRate,
                recovery_rate: recoveryRate,
                death_rate: deathRate,
                source: data.results[0].source.url
            }

            res.status(200).json({success: true, data: responseData});
        }
        else{
            res.status(400).json({success: false, error: 'API response error'});
        }
    });
}

/**
 * GET INDIA COVID-19 SUMMARY BY API
 * @param req
 * @param res
 */
exports.indiaSummary = function(req, res){
    var url = covidAPI.indiaData;
    api.apiResponse(url, function( err, data){
        if(data){
            let statData = data.cases_time_series[data.cases_time_series.length - 1];
            let testData = data.tested[data.tested.length - 1];
            let  responseData = {
                total_confirmed: parseInt(statData.totalconfirmed),
                total_recovered: parseInt(statData.totalrecovered),
                total_deaths: parseInt(statData.totaldeceased),
                currently_infected: parseInt(statData.totalconfirmed) - (parseInt(statData.totalrecovered) + parseInt(statData.totaldeceased)),
                new_confirmed: parseInt(statData.dailyconfirmed),
                new_recovered: parseInt(statData.dailyrecovered),
                new_deaths: parseInt(statData.dailydeceased),
                recovery_rate: getStatRate(statData.totalconfirmed, statData.totalrecovered),
                death_rate: getStatRate(statData.totalconfirmed, statData.totaldeceased),
                total_tests: parseInt(testData.totalsamplestested),
                test_data_source: testData.source,
                date: statData.date.trim()
            }

            res.status(200).json({success: true, data: responseData});
        }
        else{
            res.status(400).json({success: false, error: 'API response error'});
        }
    });
}

/**
 * GET DAILY INFECTION & DEATH (BOTH & SEPARATE) NUMBERS FOR INDIA
 * @param req
 * @param res
 */
exports.dailyCasesStats = function(req, res){
    var url = covidAPI.indiaData;
    api.apiResponse(url, function (err, data){
        if(data && data.hasOwnProperty('cases_time_series')){
            let cases = data.cases_time_series;
            let response = [];
            let bothArr = [];
            let infectedArr = [];
            let deathsArr = [];
            for(let i = config.span_range; i >= 1; i--){
                let key = (data.cases_time_series.length - i);
                bothArr.push({date: cases[key].date, infected: cases[key].dailyconfirmed, deaths: cases[key].dailydeceased});
                infectedArr.push({date: cases[key].date, infected: cases[key].dailyconfirmed});
                deathsArr.push({date: cases[key].date, deaths: cases[key].dailydeceased});
            }
            response = {both: bothArr, infected: infectedArr, deaths: deathsArr};
            res.status(200).json({success: true, data: response});
        }else{
            res.status(400).json({success: false, error: 'API response error'});
        }
    });
}

/**
 * GET TOTAL ACTIVE-INFECTED, RECOVERED & DEATHS
 * @param req
 * @param res
 */
exports.totalCaseStats = function(req, res){
    let url = covidAPI.indiaData;
    api.apiResponse(url, function(err, data){
        if(data && data.hasOwnProperty('cases_time_series')){
            let cases = data.cases_time_series;
            let response = [];
            for(let i = config.span_range; i >= 1; i--){
                let key = (data.cases_time_series.length - i);
                let activeInfected = parseInt(cases[key].totalconfirmed) - (parseInt(cases[key].totalrecovered) + parseInt(cases[key].totaldeceased));
                response.push({date: cases[key].date, active: activeInfected, recovered: cases[key].totalrecovered, deaths: cases[key].totaldeceased});
            }
            res.status(200).json({success: true, data: response});
        }else{
            res.status(400).json({success: false, error: 'API response error'});
        }
    });
}

/**
 * DATA FOR GEOLOCATION CHART WHICH CONCLUDES COUNTRY WITH TOTAL INFECTED
 * @param req
 * @param res
 */
exports.geolocationSummary = function(req, res){
    let url = covidAPI.globalSummary;
    api.apiResponse(url, function(err, data){
        if(data && data.hasOwnProperty('Countries')){
            let countries = data.Countries;
            let response = [];
            let index;

            response.push(['ISO2', 'COUNTRY', 'CONFIRMED CASES']); // COLUMN HEAD FOR GEO-CHART

            for(index in countries){
                response.push([
                    countries[index].CountryCode,
                    countries[index].Country,
                    countries[index].TotalConfirmed
                ]);
            }
            res.status(200).json({success: true, data: response});
        }else{
            res.status(400).json({success: false, error: 'API response error'});
        }
    });
}

/**
 * ALL COUNTRIES TOTAL DATA
 * @param req
 * @param res
 */
exports.globalStat = function(req, res){
    let url = covidAPI.globalSummary;
    api.apiResponse(url, function(err, data){
        if(data && data.hasOwnProperty('Countries')){
            let countries = data.Countries;
            let response = [];
            countries.sort(function(a, b){
                return b.TotalConfirmed-a.TotalConfirmed;
            });

            for(let i in countries){
                let country = {
                    country: countries[i].Country,
                    iso2: countries[i].CountryCode,
                    slug: countries[i].Slug,
                    flag_image: config.__site_url + config.__image_url + '/system/countries/' + countries[i].CountryCode.toLowerCase() + '.png',
                    confirmed: countries[i].TotalConfirmed,
                    recovered: countries[i].TotalRecovered,
                    deaths: countries[i].TotalDeaths,
                }
                response.push(country);
            }
            res.status(200).json({success: true, data: response});
        }else{
            res.status(400).json({success: false, error: 'API response error'});
        }
    });
}

/**
 * TOP 10 MOST AFFECTED COUNTRY LIST
 * @param req
 * @param res
 */
exports.mostAffected = function(req, res){
    let url = covidAPI.globalSummary;
    api.apiResponse(url, function(err, data){
        if(data && data.hasOwnProperty('Countries')){
            let countries = data.Countries;
            let response = [];
            countries.sort(function(a, b){
                return b.TotalConfirmed-a.TotalConfirmed;
            });

            for(let i = 0; config.top7_limit > i; i++){
                let country = {
                    country: countries[i].Country,
                    iso2: countries[i].CountryCode,
                    slug: countries[i].Slug,
                    flag_image: config.__site_url + config.__image_url + '/system/countries/' + countries[i].CountryCode.toLowerCase() + '.png',
                    confirmed: countries[i].TotalConfirmed,
                    recovered: countries[i].TotalRecovered,
                    deaths: countries[i].TotalDeaths,
                }
                response.push(country);
            }
            res.status(200).json({success: true, data: response});
        }else{
            res.status(400).json({success: false, error: 'API response error'});
        }
    });
}

/**
 * TOP 5 LEAST AFFECTED COUNTRY LIST
 * @param req
 * @param res
 */
exports.leastAffected = function(req, res){
    let url = covidAPI.globalSummary;
    api.apiResponse(url, function(err, data){
        if(data && data.hasOwnProperty('Countries')){
            let countries = data.Countries;
            let response = [];
            countries.sort(function(a, b){
                return a.TotalConfirmed-b.TotalConfirmed;
            });

            for(let i = 0; config.top5_limit > i; i++){
                let country = {
                    country: countries[i].Country,
                    iso2: countries[i].CountryCode,
                    slug: countries[i].Slug,
                    flag_image: config.__site_url + config.__image_url + '/system/countries/' + countries[i].CountryCode.toLowerCase() + '.png',
                    confirmed: countries[i].TotalConfirmed,
                    recovered: countries[i].TotalRecovered,
                    deaths: countries[i].TotalDeaths,
                }
                response.push(country);
            }
            res.status(200).json({success: true, data: response});
        }else{
            res.status(400).json({success: false, error: 'API response error'});
        }
    });
}

/**
 * GLOBAL RATIO
 * @param req
 * @param res
 */
exports.globalRatio = function(req, res){
    let url = covidAPI.globalSummary;
    api.apiResponse(url, function(err, data){
        if(data && data.hasOwnProperty('Countries')){
            let totalGlobalConfirmed = data.Global.TotalConfirmed;
            let countries = data.Countries;
            let response = [];
            countries.sort(function(a, b){
                return b.TotalConfirmed-a.TotalConfirmed;
            });

            for(let i = 0; config.top7_limit > i; i++){
                let country = {
                    country: countries[i].Country,
                    iso2: countries[i].CountryCode,
                    slug: countries[i].Slug,
                    flag_image: config.__site_url + config.__image_url + '/system/countries/' + countries[i].CountryCode.toLowerCase() + '.png',
                    confirmed: countries[i].TotalConfirmed,
                    ratio: getStatRate(totalGlobalConfirmed, countries[i].TotalConfirmed),
                }
                response.push(country);
            }
            res.status(200).json({success: true, data: response});
        }else{
            res.status(400).json({success: false, error: 'API response error'});
        }
    });
}

exports.countryData = function(req, res){
  let slug = req.params.slug;
  Countries.findOne({slug: slug}).exec(function(err, countryData){
    if(countryData){
      let response = {
        name: countryData.country,
        iso2: countryData.iso2,
        slug: slug,
        flag_image: config.__site_url + config.__image_url + '/system/countries/' + countryData.iso2.toLowerCase() + '.png',
      }
      res.status(200).json({success: true, data: response});
    }else{
      res.status(400).json({success: false, error: 'invalid slug given'});
    }
  })
}

/**
 * COUNTRY ALL STATUS LIST FOR LAST 30 DAYS
 * @param req
 * @param res
 */
exports.countryTimeLineData = function(req, res){
    let slug = req.params.slug;
    Countries.findOne({slug: slug}).exec(function(err, countryData){
        if(countryData){
            let url = covidAPI.countryStatusAll;
            url = url.replace('[[COUNTRY]]', slug);
            api.apiResponse(url, function(err, data){
                if(data){
                    let response = [];

                    for(let i = config.span_range; i >= 1; i--){
                        let key = (data.length - i);
                        response.push({
                            date: data[key].Date,
                            confirmed: data[key].Confirmed,
                            recovered: data[key].Recovered,
                            deaths: data[key].Deaths,
                            active: data[key].Active
                        });
                    }

                    res.status(200).json({success: true, data: response});
                }else{
                    res.status(400).json({success: false, error: 'API response error'});
                }
            });
        }
        else{
            res.status(400).json({success: false, error: 'invalid slug given'});
        }
    });
}

/**
 * COUNTRY SUMMARY
 * @param req
 * @param res
 */
exports.countrySummary = function(req, res){
    let slug = req.params.slug;
    Countries.findOne({slug: slug}).exec(function(err, countryData){
        if(countryData){
            let iso = countryData.iso2;
            let url = covidAPI.countryStatus;
            api.apiResponse(url, function(err, countryArr){
                if(countryArr){

                    let response = [];

                    for(let key in countryArr){
                        if(countryArr[key].country === iso.toUpperCase()){
                             response = {
                                country: countryData.country,
                                iso2: iso,
                                flag_image: config.__site_url + config.__image_url + '/system/countries/' + countryData.iso2.toLowerCase() + '.png',
                                slug: countryData.slug,
                                global_rank: parseInt(key)+1,
                                infected: countryArr[key].cases,
                                active: countryArr[key].cases - (parseInt(countryArr[key].recovered) + parseInt(countryArr[key].deaths)),
                                recovered: countryArr[key].recovered,
                                recovery_rate: getStatRate(countryArr[key].cases, countryArr[key].recovered),
                                deaths: countryArr[key].deaths,
                                death_rate: getStatRate(countryArr[key].cases, countryArr[key].deaths)
                            }
                            break;
                        }
                    }

                    if(Object.keys(response).length > 0){
                        res.status(200).json({success: true, data: response});
                    }else{
                        res.status(400).json({success: false, error: 'data not found'});
                    }

                }else{
                    res.status(400).json({success: false, error: 'API response error'});
                }
            });
        }else{
            res.status(400).json({success: false, error: 'invalid slug given'});
        }
    });
}

/**
 * INDIA STATE WISE DISTRIBUTION OF COVID-19
 * @param req
 * @param res
 */
exports.indiaStateData = function(req, res){
    let url = covidAPI.indiaStateData;
    api.apiResponse(url, function(err, data){
        if(data && data.hasOwnProperty('state_data')){
            let response = [];
            for(let i in data.state_data){
                response.push({
                    state: data.state_data[i].state,
                    statecode: (lib.getStateCode(data.state_data[i].state)) ? lib.getStateCode(data.state_data[i].state) : 'unknown',
                    confirmed: data.state_data[i].confirmed,
                    active: data.state_data[i].active,
                    active_rate: data.state_data[i].active_rate,
                    deaths: data.state_data[i].deaths,
                    death_rate: data.state_data[i].death_rate,
                    recovered: data.state_data[i].recovered,
                    recovered_rate: data.state_data[i].recovered_rate,
                });
            }

            res.status(200).json({success: true, data: response});
        }
        else{
            res.status(400).json({success: false, error: 'API response error'});
        }
    });
}

/**
 * INDIA DISTRICT WISE DISTRIBUTION BY STATE ISO2 CODE OF COVID-19
 * @param req
 * @param res
 */
exports.indiaStateWiseDistrictData = function(req, res){
    let url = covidAPI.indiaStateWiseDistrictData;
    api.apiResponse(url, function(err, stateData){
        if(stateData){
            let response = [];
            for(let state in stateData){
                if(stateData[state].statecode === req.params.statecode){
                    let districtData = stateData[state].districtData;
                    let districtArr = [];

                    for(let district in districtData){
                        let data = {
                            district: district,
                            confirmed: districtData[district].confirmed,
                            active: districtData[district].active,
                            recovered: districtData[district].recovered,
                            deaths: districtData[district].deceased,
                            notes: districtData[district].notes
                        }
                        districtArr.push(data);

                        districtArr.sort(function(a, b){
                            return b.active - a.active;
                        });
                    }

                    response = {
                        state: state,
                        district_data: districtArr
                    }
                }
            }

            res.status(200).json({success: true, data: response});
        }
        else{
            res.status(400).json({success: false, error: 'API response error'});
        }
    });
}

/**
 * INDIA COVID CASES TIME LINE STATE WISE
 * @param req
 * @param res
 */
exports.indiaStateTimeline = function(req, res){
    let url = covidAPI.indiaStateTimeLine
    api.apiResponse(url, function(err, timelineData){
        if(timelineData){
            let state = lib.getStateName(req.params.statecode);
            let response = [];
            let data = [];
            let num = null;
            for(let i in timelineData){
                if(state === timelineData[i]['State UT'].toLowerCase()){
                    for(let key in timelineData[i]) {
                        if(key !== 'State UT'){
                            num = {
                                cases : timelineData[i][key],
                                date: key
                            }
                            data.push(num);
                        }
                    }
                }
            }

            response.push(data);
            res.status(200).json({success: true, data: response});
        }
        else{
            res.status(400).json({success: false, error: 'API response error'});
        }
    });
}

/**
 * GLOBAL TIME SERIES INFECTED & DEATHS (BOTH & SEPARATE)
 * @param req
 * @param res
 */
exports.globalTimeSeries = function(req, res){
    let dates = getDateRange(config.span_range);
    let date1 = dates.dateFrom+'T00:00:00Z';
    let date2 = dates.dateTo+'T00:00:00Z';

    let url = covidAPI.worldStatusTotal;
    url = url.replace('[[DATE1]]', date1);
    url = url.replace('[[DATE2]]', date2);

    let datesArr = getDates(new Date(date1), new Date(date2));

    api.apiResponse(url, function(err, seriesData){
        if(seriesData){
            let response = [];
            let data = [];
            let labeslArr = [];
            let infectedArr = [];
            let deathsArr = [];

            for(let key in seriesData){
                labeslArr.push(formatDate(datesArr[key], 2));
                deathsArr.push(seriesData[key].NewDeaths);
                infectedArr.push(seriesData[key].NewConfirmed);
            }
            response = {labels: labeslArr, infected: infectedArr, deaths: deathsArr};

            res.status(200).json({success: true, data: response});
        }
        else{
            res.status(400).json({success: false, error: 'API response error'});
        }
    });
}

/**
 * GLOBAL TOTAL TIME SERIES
 * @param req
 * @param res
 */
exports.globalTotalTimeSeries = function(req, res){
    let dates = getDateRange(config.span_range);
    let date1 = dates.dateFrom+'T00:00:00Z';
    let date2 = dates.dateTo+'T00:00:00Z';

    let url = covidAPI.worldStatusTotal;
    url = url.replace('[[DATE1]]', date1);
    url = url.replace('[[DATE2]]', date2);

    let datesArr = getDates(new Date(date1), new Date(date2));

    api.apiResponse(url, function(err, data){
        if(data){
            let response = [];
            let labeslArr = [];
            let recoveredArr = [];
            let activeCaseArr = [];
            let deathsArr = [];

            for(let key in data){
                labeslArr.push(formatDate(datesArr[key], 2));
                activeCaseArr.push(parseInt(data[key].TotalConfirmed) - (parseInt(data[key].TotalRecovered) + parseInt(data[key].TotalDeaths)));
                recoveredArr.push(data[key].TotalRecovered);
                deathsArr.push(data[key].TotalDeaths);
            }

            response.push({
                labels: labeslArr,
                active: activeCaseArr,
                recovered: recoveredArr,
                deaths: deathsArr
            });

            res.status(200).json({success: true, data: response});
        }
        else{
            res.status(400).json({success: false, error: 'API response error'});
        }
    });
}
