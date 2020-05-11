"use strict";

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

var UserAdminSchema = new Schema({
    first_name: {
        type: String,
        required: 'please enter the first name',
        default: null
    },
    last_name: {
        type: String,
        required: 'please enter the last name',
        default: null
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'email address is required',
        //validate: { validator: isEmail, message: 'Invalid email.' },
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'please fill a valid email address']
    },
    password: {
        type: String,
        required: 'please enter the password',
        minlength: 6,
        maxlength: 12
    },
    mobile: {
        type: String,
        trim: true,
        unique: true,
        match: [/^[789]\d{9}$/, 'please fill a valid mobile number']
    },
    status: {
        type: [{
            type: String,
            enum: ['active', 'inactive']
        }],
        default: ['active']
    }
});
