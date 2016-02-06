// =======================
// get the packages we need ============
// =======================
var express = require('express');
var api = express();
var bodyParser  = require('body-parser');
var jwt = require('jsonwebtoken');
var moment = require('moment');

// =======================
// get the files we need ============
// =======================
var config = require("../../config.js");
var User = require('../models/user.js'); // get user mongoose model
var Book = require('../models/book.js'); // get book mongoose model

// =======================
// configuration =========
// =======================
api.set('superSecret', config.secret);

// use body parser so we can get info from POST and/or URL parameters
api.use(bodyParser.urlencoded({ extended: false }));
api.use(bodyParser.json());

// =======================
// routes ================
// =======================
api.route('/')

  .get(function(req, res) { // get request for handling api call for list of url's
    var urls = ["authApi/register", "authApi/login", "api/", "api/updateToken"];
    res.json({success: true, message: "Welcome to BookaBook api", urls: urls});
  });

api.use(function(req, res, next) { // middleware function all requests goes through this
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token) {
      jwt.verify(token, api.get('superSecret'), function(err, decoded) {
        if (err) {
          return res.json({success: false, message: 'Failed to authenticate token!'});
        } else {
          if(decoded.expires <= Date.now()) {
            res.json({success: false, message: 'Token has Expired!'});
          } else {
            req.userId = decoded.userId;
            next();
          }
        }
      });
    } else {
      res.json({success: false, message: 'No token provided!'});
    }
});

api.route('/updateToken')

  .get(function(req, res) { // get request for handling api call for updating token
    var expires = moment().add(7, 'days').valueOf(); // token expires in 7 days
    var tokenData = {
      id: req.userId,
      exp: expires
    };
    var token = jwt.sign(tokenData, api.get('superSecret'));
    res.json({success: true, message: "Token Updated", token: token})
  });


module.exports = api;
