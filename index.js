require('dotenv').config();
var express = require("express");
var bodyParser = require("body-parser");
var cors = require('cors');
var app = express(); 
var router = require('./routes/route');

// Body Parser Middleware
app.use(bodyParser.json()); 
app.use(cors());
app.use('/', router);

//Setting up server
var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log("API is live on port", port, '\n');
});

module.exports = app;
module.exports = server;