"use strict";

const config = require('../../config');
const covidAPI = require('../../covidTracker');
const api = require('../../api')

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
 * GET GLOBAL COVID-19 SUMMARY BY API
 * @param req
 * @param res
 */
exports.globalSummary = function(req, res){
    var url = covidAPI.globalSummary;
    api.apiResponse(url, function( err, data){
        if(data){
            let  responseData = {
                total_confirmed: data.Global.TotalConfirmed,
                total_recovered: data.Global.TotalRecovered,
                total_deaths: data.Global.TotalDeaths,
                new_confirmed: data.Global.NewConfirmed,
                new_recovered: data.Global.NewRecovered,
                recovery_rate: getStatRate(data.Global.TotalConfirmed, data.Global.TotalRecovered),
                death_rate: getStatRate(data.Global.TotalConfirmed, data.Global.TotalDeaths)
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
                new_confirmed: parseInt(statData.dailyconfirmed),
                new_recovered: parseInt(statData.dailyrecovered),
                new_deaths: parseInt(statData.dailydeceased),
                currently_infected: parseInt(statData.totalconfirmed) - (parseInt(statData.totalrecovered) + parseInt(statData.totaldeceased)),
                total_tests: parseInt(testData.totalsamplestested),
                test_data_source: testData.source,
                date: statData.date,
                recovery_rate: getStatRate(statData.totalconfirmed, statData.totalrecovered),
                death_rate: getStatRate(statData.totalconfirmed, statData.totaldeceased)
            }

            res.status(200).json({success: true, data: responseData});
        }
        else{
            res.status(400).json({success: false, error: 'API response error'});
        }
    });
}

/**
 * GET DAILY INFECTION & DEATH (BOTH & SEPARATE) NUMBERS
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
            for(index in countries){
                response.push({country: countries[index].Country, iso2: countries[index].CountryCode, slug: countries[index].Slug, confirmed: countries[index].TotalConfirmed});
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

            for(let i = 0; config.top10_limit > i; i++){
                let country = {
                    country: countries[i].Country,
                    iso2: countries[i].CountryCode,
                    slug: countries[i].Slug,
                    flag_image: config.__image_url + '/' + countries[i].CountryCode.toLowerCase() + '.png',
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

            for(let i = 0; config.top5_limit > i; i++){
                let country = {
                    country: countries[i].Country,
                    iso2: countries[i].CountryCode,
                    slug: countries[i].Slug,
                    flag_image: config.__image_url + '/' + countries[i].CountryCode.toLowerCase() + '.png',
                    confirmed: countries[i].TotalConfirmed,
                    ratio: getStatRate(totalGlobalConfirmed, countries[i].TotalConfirmed),
                }
                response.push(country);
            }
            res.status(200).json({success: true, data: response});
        }else{
            res.status(400).json({success: false, error: 'API response error'});
        }
    })
}