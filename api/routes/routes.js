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
    app.route('/daily-cases-timeseries')
        .get(covid.dailyCasesStats);
    app.route('/total-cases-timeseries')
        .get(covid.totalCaseStats);
    app.route('/geolocation-summary')
        .get(covid.geolocationSummary);
    app.route('/most-affected-countries')
        .get(covid.mostAffected);
    app.route('/global-ratio')
        .get(covid.globalRatio);
    app.route('/least-affected-countries')
        .get(covid.leastAffected);
    app.route('/global-stat-list')
        .get(covid.globalStat);
    app.route('/country-data/:slug')
        .get(covid.countryData);
};

