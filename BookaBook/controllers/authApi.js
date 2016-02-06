// =======================
// get the packages we need ============
// =======================
var express = require('express');
var authApi = express();
var bodyParser  = require('body-parser');
var jwt = require('jsonwebtoken');
var moment = require('moment');

// =======================
// get the files we need ============
// =======================
var config = require("../../config.js");
var User = require('../models/user.js'); // get user mongoose model

// =======================
// configuration =========
// =======================
authApi.set('superSecret', config.secret);

// use body parser so we can get info from POST and/or URL parameters
authApi.use(bodyParser.urlencoded({ extended: true }));
authApi.use(bodyParser.json());

// =======================
// routes ================
// =======================
authApi.route('/register')

  .post(function(req, res) { // post request for handling /register starts here
    User.findOne({phoneNum: req.body.phoneNum}, function(err, user) {

      if(err) {
        res.json({success: false, message: "Error while accessing database!"});
        throw err;
      }
      if(user) { // user with same number exists in this database
        res.json({success: false, message: "User already registered!"});
      } else if(!user) { // new user

        var user = new User({
          name: name,
          phoneNum: phoneNum
        });
        user.setPassword(password);

        user.save(function(err) {
          if(err) {
            res.json({success: false, message: "Error while registering user!"});
            throw err;
          }
          console.log("User saved successfully");
          res.json({success: true, message: "User saved successfully!"});
        });

      }

    });
  }); // post request for handling /register ends here

authApi.route('/login')

  .post(function(req, res){ // post request for handling /login starts here
    User.findOne({phoneNum: req.body.phoneNum}, function(err, user) {

      if(err) {
        res.json({success: false, message: "Error while accessing database!"});
        throw err;
      }
      if(!user) {
        res.json({success: false, message: 'Invalid email or password!'});
      } else if(user) {
        if(!user.isValidPassword(req.body.password)) {
          res.json({success: false, message: 'Invalid email or password!'});
        }else {
          var expires = moment().add(7, 'days').valueOf(); // token expires in 7 days
          var tokenData = {
            id: user._id,
            exp: expires
          };
          var token = jwt.sign(tokenData, authApi.get('superSecret'));
          res.json({success: true, message: "Login Successfull", token: token}); // return a token also
        }
      }

    });
  }); // post request for handling /login ends here

module.exports = authApi;
