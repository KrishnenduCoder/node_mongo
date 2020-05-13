/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = {
    port: 3000,
    secret : 'Afv2ilj0iaT1@sB6r345-ipn0ilu9maI-Tn2n9eR',
    dev_mode : true,
    __site_url: 'http://localhost:3000/',
    __admin_url: 'http://localhost:4400/',
    __image_url: '/images',
    email: {
        host: 'smtp.gmail.com',
        user: '',
        pass: '',
        adminEmail: '',
        port: 465,
        service: 'gmail',
        fromName: 'no-reply'
    },
    status: {
        OK: 200,
        CREATED: 201,
        FOUND: 302,
        BAD_REQUEST: 400,
        NOT_AUTHORIZED: 401,
        PAYMENT_REQUERED: 402,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        CONFLICT: 409,
        SERVER_ERROR: 500,
        NO_SERVICE: 503
    },
    serverRunMsg: 'Express server is running at port no : ',
    homeTitle: 'NodeJS Restful API',
    hash_salt: null,
    hash_progress: null,
};

module.exports = config;

