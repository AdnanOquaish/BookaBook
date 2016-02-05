var express = require('express');
var app = express();
var morgan = require('morgan');
var path    = require("path");

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/BookaBook');

var api = require('./BookaBook/controllers/api.js');
var authApi = require('./BookaBook/controllers/authApi.js');

var port = process.env.PORT || 8080;

app.use(morgan('dev')); // logger

//app.use("/api", api); // common api urli's
//app.use("/authApi", authApi);  // authhentiaction related url's


app.listen(port);
console.log("Magic happens on port " + port);
