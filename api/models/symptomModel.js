"use strict";

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SymptomSchema = new Schema({
        title: {
            type: String,
            required: 'please provide symptom title'
        },
        description: {
            type: String,
            required: 'please provide symptom description'
        },
        category: {
            type: String,
            required: 'please provide symptom category'
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

module.exports = mongoose.model('Symptoms', SymptomSchema);