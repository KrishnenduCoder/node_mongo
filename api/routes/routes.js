'use strict';
module.exports = function(app){
    var user = require('../controllers/userController');
    var country = require('../controllers/countryController');
    var covid = require('../controllers/covidController');

    // USER ROUTES
    app.route('/login')
        .post(user.login);

    // COUNTRY ROUTES
    app.route('/countries')
        .get(country.countries);

    // COVID ROUTES
    app.route('/global-summary')
        .get(covid.globalSummary);
    app.route('/india-summary')
        .get(covid.indiaSummary);
    app.route('/cases-timeseries')
        .get(covid.newCasesStats)
};

