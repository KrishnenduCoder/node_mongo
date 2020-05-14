'use strict';
module.exports = function(app){
    var user = require('../controllers/userController');
    var country = require('../controllers/countryController');

    // USER ROUTES
    app.route('/login')
        .post(user.login);

    // COUNTRY ROUTES
    app.route('/countries')
        .get(country.countries);
}

