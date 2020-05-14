"use strict";

const mongoose = require('mongoose');
var Countries = mongoose.model('Countries');
const config = require('../../config');

/**
 * LIST OF ALL COUNTRIES SORT BY ISO2
 * @param req
 * @param res
 */
exports.countries = function (req, res){
    Countries.find()
        .sort({"iso2" : 1})
        .exec(function (err, countryList){
        if(countryList){
            res.status(200).json({success: true, data: countryList});
        }
    });
}