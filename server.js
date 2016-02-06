// =======================
// get the packages we need ============
// =======================
var express = require('express');
var app = express();
var morgan = require('morgan');
var mongoose   = require('mongoose');

// =======================
// get the files we need ============
// =======================
var config = require("./config.js");
var authApi = require('./BookaBook/controllers/authApi.js');
var api = require('./BookaBook/controllers/api.js');

// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080;
mongoose.connect('mongodb://localhost:27017/BookaBook');

// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// routes ================
// =======================
app.use("/authApi", authApi);  // authhentiaction related url's
app.use("/api", api);  // api related url's

app.listen(port);
console.log("Magic happens on port " + port);
