const express = require('express');
const app = express();
const config = require('./config');
const dbConfig = require('./dbConfig');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const path = require('path');

// MODEL LOADING
const Country = require('./api/models/countryModel'); //country model
const User = require('./api/models/userModel'); //user model
const Symptom = require('./api/models/symptomModel');
const Prevention = require('./api/models/preventionModel');
const MythBuster = require('./api/models/mythBusterModel');

const port = process.env.PORT || config.port;

// MONGO DATABASE CONNECTION
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.dataBase, { useMongoClient: true });

// URL PARSING
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(methodOverride());
// SET STATIC DIRECTORY
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));

// AUTHENTICATE REQUESTS
var auth = require('./auth');
app.use(auth);

// VIEW PATH & TEMPLATE ENGINE SET
app.set('views', path.join(__dirname, '/api/views'));
app.set('view engine', 'ejs');
var index = require('./api/routes/index');
app.use('/', index);

// SET ROUTES
const routes = require('./api/routes/routes');
routes(app);

// RUN THE SERVICE
app.listen(port, function (){
    console.log(config.serverRunMsg + config.port);
});

