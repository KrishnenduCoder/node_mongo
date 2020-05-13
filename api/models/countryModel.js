"use strict";

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CountrySchema = new Schema({
        country : {
            type: String,
            required: 'please provide country name',
        },
        slug : {
            type: String,
            required: 'please provide country slug',
        },
        iso2: {
            type: String,
            required: 'please provide country slug',
        }
    },
    {
        timestamps: true,
        typecast: true
    });

module.exports = mongoose.model('Countries', CountrySchema)