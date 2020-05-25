"use strict";

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MythBusterSchema = new Schema({
        title: {
            type: String,
            required: 'please provide myth-buster title'
        },
        description: {
            type: String,
            required: 'please provide myth-buster description'
        },
        image: {
            type: String,
            required: 'please provide myth-buster myth-buster'
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

module.exports = mongoose.model('MythBuster', MythBusterSchema);