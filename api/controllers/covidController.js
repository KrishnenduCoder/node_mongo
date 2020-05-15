"use strict";

const config = require('../../config');
const covid = require('../../covidTracker');
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
    var url = covid.globalSummary;
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
    var url = covid.indiaData;
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

exports.newCasesStats = function(req, res){
    var url = covid.indiaData;
    console.log(url);
}