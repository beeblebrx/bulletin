'use strict';

var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose');

/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Application Config
var config = require('./lib/config/config');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
    if (/(.*)\.(js$|coffee$)/.test(file)) {
        require(modelsPath + '/' + file);
    }
});

// Passport Configuration
require('./lib/config/passport');

var app = express();

// Express settings
require('./lib/config/express')(app);

// Routing
require('./lib/routes')(app);

// Start server
app.listen(config.port, function () {
    console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
});

var Settings = mongoose.model('Settings');
Settings.findOne({'_id': 1}, function(err, s) {
    if (err) {
        console.log(err);
        return err;
    }

    GLOBAL.APP_SETTINGS = s;
});

// Expose app
exports = module.exports = app;
