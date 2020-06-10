'use strict';
module.exports = function(app){
    var user = require('../controllers/userController');
    var country = require('../controllers/countryController');
    var covid = require('../controllers/covidController');
    var prevention = require('../controllers/preventionController');

    // USER ROUTES
    app.route('/login')
        .post(user.login);

    // COUNTRY ROUTES
    app.route('/countries')
        .get(country.countries);

    // PREVENTION ROUTES
    app.route('/preventions')
        .get(prevention.preventionLists)

    // COVID ROUTES
    app.route('/global-summary')
        .get(covid.globalSummary);

    app.route('/india-summary')
        .get(covid.indiaSummary);

    app.route('/global-timeseries')
        .get(covid.globalTimeSeries);

    app.route('/global-total-timeseries')
        .get(covid.globalTotalTimeSeries);

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

    app.route('/country-timeline-data/:slug')
        .get(covid.countryTimeLineData);

    app.route('/country-summary/:slug')
        .get(covid.countrySummary);

    app.route('/india-state')
        .get(covid.indiaStateData);

    app.route('/india-districtdata/:statecode')
        .get(covid.indiaStateWiseDistrictData);

    app.route('/india-stetetimeline/:statecode')
        .get(covid.indiaStateTimeline);
};
