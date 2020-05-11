"use strict";

const express = require('express');
const router = express.Router();
const config = require('../../config');

router.get('/', function (req, res){
    res.render('index', {'title' : config.homeTitle, logo: config.__image_url+'/node-mongo.png'});
});

module.exports = router;