'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Bulletin = mongoose.model('Bulletin');

/**
 * Populate database with test data
 */

// Setup test bulletin data
module.exports.initBulletins = function(done) {
    Bulletin.find({}).remove(function() {
        Bulletin.create([{
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
        }],
        function() {
            console.log('finished populating bulletins');
            done();
        }
        );
    });
};

// Clear old users, then add a test user
module.exports.initUsers = function(done) {
    User.find({}).remove(function() {
        User.create({
            provider: 'local',
            name: 'Test User',
            email: 'test@test.com',
            password: 'test'
        }, function() {
            console.log('finished populating users');
            done();
        }
        );
    });
};
