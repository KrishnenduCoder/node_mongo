"use strict";

const config = require('../../config');
const covid = require('../../covidTracker');
const api = require('../../api')

/**
 * GET GLOBAL COVID-19 SUMMARY BY API
 * @param req
 * @param res
 */
exports.globalSummary = function(req, res){
    var url = covid.globalSummary;
    api.apiResponse(url, function( err, data){
        if(data) res.status(200).json({success: true, data: data.Global});
        else res.status(200).json({success: false, error: 'API response error'});
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
        if(data) res.status(200).json({success: true, data: data.cases_time_series[data.cases_time_series.length - 1]});
        else res.status(200).json({success: false, error: 'API response error'});
    });
}