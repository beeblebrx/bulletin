'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Bulletin = mongoose.model('Bulletin'),
    Settings = mongoose.model('Settings');

// Setup test bulletin data
module.exports.initBulletins = function() {
    return Bulletin.create([{
            title : 'The first bulletin',
            text : 'This is the first bulletin.'
        },
        {
            title : 'The second bulletin',
            text : 'This is the second bulletin.'
        },
        {
            title : 'The third bulletin',
            text : 'This is the third bulletin.'
        }]);
};

// Clear old users, then add a test user
module.exports.initUsers = function() {
    return User.create({
            provider: 'local',
            name: 'Test User',
            email: 'test@test.com',
            password: 'test'
        });
};

// Store application settings
module.exports.initSettings = function() {
    return Settings.create({
            _id: 1,
            idHashSalt: 'suolaasuolaa'
        });
};
