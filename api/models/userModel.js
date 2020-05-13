"use strict";

const config = require('../../config');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

/**
 * USER MODEL (COLLECTION) SCHEMA
 */
var UserSchema = new Schema({
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
        state: {
            type: String,
            default: null
        },
        address: {
            type: String,
            default: null
        },
        access_token: {
            type: String,
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


UserSchema.pre('save', function(next){
    var user = this;
    if(!user.isModified('password')){ return next(); }

    if(user.password){
        bcrypt.hash(user.password, config.hash_salt, config.hash_progress, function(err, hash){
            if(err){ return next(err); }
            user.password = hash;
            next();
        });
    }
});

/**
 * COMPARE PASSWORD HASH
 * @param password
 * @returns {boolean}
 */
UserSchema.methods.comparePassword = function(password){
    try
    {
        var user = this;
        return bcrypt.compareSync(password, user.password);
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
};

var Users = mongoose.model('Users', UserSchema);

module.exports = Users;