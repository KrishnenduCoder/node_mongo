"use strict";

const mongoose = require('mongoose');
const Preventions = mongoose.model('Preventions');
const Countries = mongoose.model('Countries');
const config = require('../../config');
const covidAPI = require('../../covidTracker');
const api = require('../../api');
const lib = require('../../lib/app');

/**
 * GET ALL PREVENTIONS & CASES FROM IP LOCATION
 * @param req
 * @param res
 */
exports.preventionLists = function(req, res){
    let response = [];
    Preventions.find({status: "active"})
        .exec(function(err, preventionList){
            if(preventionList){
                let ipAddress = lib.getIP(req);
                let url = covidAPI.ipDetails;
                url = url.replace('[[IP_ADDRESS]]', ipAddress);
                api.apiResponse(url, function(err, ipDetails){
                    if(ipDetails){
                        let countryCode = ipDetails.countryCode;
                        Countries.findOne({iso2: countryCode})
                            .exec(function(err, countryData){
                                if(countryData){
                                    let countryUrl = covidAPI.countryStatus;
                                    api.apiResponse(countryUrl, function(err, countryStatus){
                                        if(countryStatus){
                                            let cases = [];
                                            let preventions = [];
                                            for(let i in countryStatus){
                                                if(countryCode === countryStatus[i].country){
                                                    cases = {
                                                        ip_address: ipAddress,
                                                        country: countryData.country,
                                                        slug: countryData.slug,
                                                        country_code: countryCode,
                                                        iso2: countryCode,
                                                        flag_image: config.__site_url + config.__image_url + '/system/countries/' + countryData.iso2.toLowerCase() + '.png',
                                                        cases: countryStatus[i].cases,
                                                        deaths: countryStatus[i].deaths,
                                                        recovered: countryStatus[i].recovered,
                                                        date: countryStatus[i].last_update
                                                    }
                                                }
                                            }

                                            for(let i in preventionList) {
                                                let preventionData = {
                                                    title: preventionList[i].title,
                                                    category: preventionList[i].category
                                                }

                                                preventions.push(preventionData);
                                            }

                                            response.push({preventions: preventions, cases: cases});
                                            res.status(200).json({success: true, data: response});
                                        }
                                        else{
                                            res.status(400).json({success: false, error: 'API response error: ' + err});
                                        }
                                    });
                                }
                                else{
                                    res.status(400).json({success: false, error: 'API response error: ' + err});
                                }
                            });
                    }
                    else{
                        res.status(400).json({success: false, error: 'API response error: ' + err});
                    }
                });
            }
            else{
                res.status(400).json({success: false, error: 'API response error'});
            }
        });
}