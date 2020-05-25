"use strict";

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PreventionSchema = new Schema({
        title: {
            type: String,
            required: 'please provide prevention title'
        },
        category: {
            type: String,
            required: 'please provide prevention category'
        },
        status: {
            type: [{
                type: String,
                enum: ['active', 'inactive']
            }],
            default: ['active']
        }
    },
    {
        timestamps: true,
        typecast: true
    });

module.exports = mongoose.model('Preventions', PreventionSchema);