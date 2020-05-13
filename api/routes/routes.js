'use strict';
module.exports = function(app){
    var user = require('../controllers/userController');

    // USER ROUTES
    app.route('/login').post(user.login);
}

