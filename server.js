const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('./config');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const path = require('path');

// URL PARSING
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(methodOverride());
// SET STATIC DIRECTORY
app.use(express.static(path.join(__dirname, 'public')));

