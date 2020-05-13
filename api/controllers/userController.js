"use strict";

const mongoose = require('mongoose');
const User = mongoose.model('Users');
const config = require('../../config');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const generator = require('generate-password');
const hbs = require('nodemailer-express-handlebars');

/**
 * CREATE JWT TOKEN
 * @param user
 * @returns {undefined|*}
 */
function createToken(user) {
    var tokenData = {
        _id: user._id,
        email: user.email,
        role: user.role
    };
    var token = jwt.sign(tokenData, config.secret, {
        expiresIn: "5 days"
    });
    return token;
}

/**
 * USER LOGIN
 * @param req
 * @param res
 */
exports.login = function(req, res){
    try
    {
        if(req.body.email && req.body.password)
        {
            var email = req.body.email;
            User.findOne({email: email})
                .exec(function (err, user){
                    if (err)
                    {
                        res.json({success: false, error: err});
                    }
                    else
                    {
                        if(!user)
                        {
                            res.json({success: false, message: "Invalid EmailID"});
                        }
                        else
                        {
                            if (!user.comparePassword(req.body.password))
                            {
                                console.log('Invalid Password');
                                res.json({success: false, message: "Invalid Password"});
                            }
                            else if(user.status === 'inactive')
                            {
                                res.json({success: false, message: "Your account still is inactive"});
                            }
                            else
                            {
                                var token = createToken(user);
                                var sessData = {
                                    name : user.first_name + user.last_name,
                                    email : user.email,
                                    token : token,
                                };
                                //req.session.admin = sessData;
                                res.json({success:true, data:sessData, message: "Logged in successful"});
                            }
                        }
                    }
                });
        }
        else
        {
            res.json({success: false, message: "Email and Password is required"});
        }
    }
    catch(e)
    {
     res.json({success: false, message: e});
    }
};