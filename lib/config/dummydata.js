'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Bulletin = mongoose.model('Bulletin'),
    Settings = mongoose.model('Settings');

/**
 * Populate database with test data
 */
module.exports.clearTestData = function() {
    console.log('Etsitään bulletiinit');
    return Bulletin.find({}).exec()
        .then(function(bulletins) {
            console.log('Tyhjätään bulletiinit');
            return bulletins.remove().exec();
        })
        .then(function() {
            console.log('Etsitään käyttäjät');
            return User.find({}).exec();
        })
        .then(function (users) {
            console.log('Tyhjätään käyttäjät');
            return users.remove().exec();
        })
        .then(function() {
            console.log('Etsitään asetukset');
            return Settings.findOne({_id:1}).exec();
        })
        .then(function(settings) {
            console.log('Tyhjätään asetukset');
            return settings.remove().exec();
        });
};

// Setup test bulletin data
module.exports.initBulletins = function() {
    console.log('Tehään bulletiinit!');
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
    console.log('Tehään käyttäjät!');
    return User.create({
            provider: 'local',
            name: 'Test User',
            email: 'test@test.com',
            password: 'test'
        });
};

// Store application settings
module.exports.initSettings = function() {
    console.log('Tehään asetukset!');
    return Settings.create({
             _id: 1,
            idHashSalt: 'suolaasuolaa'
        });
};
