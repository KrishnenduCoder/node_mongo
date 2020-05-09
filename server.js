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



// RUN THE SERVICE
app.listen(port, function (){
    console.log(config.serverRunMsg + config.port);
});

