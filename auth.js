"use strict";

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const config = require('./config');
// ROUTES THAT DO NOT NEED AUTH
const openRoutes = [
    '/',
    '/login',
    '/forgot_password',
    '/about-us',
    '/faq'
];

// ACCESS TOKEN VERIFICATION
module.exports = function(req, res, next) {
    var token = req.body.token || req.param('token') || req.headers['x-access-token'];
    // CHECK IF URL IS OPEN-ROUTE
    var position = openRoutes.indexOf(req.url);

    if (position >= 0)
    {
        next();
    }
    else
    {
        if(token)
        {
            jwt.verify(token, config.secret, function(err, decoded) {

                if(err)
                {
                    res.status(403).send({ success: false, message: "failed to authenticate" });
                }
                else
                {
                    req.decoded = decoded;
                    next();
                }
            });
        }
        else if(req.method !== 'OPTIONS')
        {
            res.status(403).send({ success: false, message: "token required" });
        }
        else
        {
            next();
        }
    }
};
