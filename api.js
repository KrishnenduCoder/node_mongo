"use strict";

const superagent  = require('superagent');

/**
 * CALLING API FOR COVID-19 DATA BY GET HTTP METHOD
 * @param url
 * @param callback
 */
exports.apiResponse = function(url, callback){
    /*superagent
        .get(url)
        .set('accept', 'json')
        .end(function(err, res){
        if(res){
            return callback(false, res.body);
        }else{
            return callback(err, false);
        }
    });*/

    (async () => {
        try {
            const res = await superagent.get(url);
            return callback(false, res.body);
        } catch (err) {
            return callback(err, false);
        }
    })();
}