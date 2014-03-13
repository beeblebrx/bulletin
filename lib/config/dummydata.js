'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Thing = mongoose.model('Thing');

/**
 * Populate database with sample application data
 */

//Clear old things, then add things in
Thing.find({}).remove(function() {
    Thing.create({
        name : 'The first thing',
        info : 'This is the first thing.'
    }, function() {
        console.log('finished populating things');
    }
    );
});

// Clear old users, then add a default user
User.find({}).remove(function() {
    User.create({
        provider: 'local',
        name: 'Test User',
        email: 'test@test.com',
        password: 'test'
    }, function() {
        console.log('finished populating users');
    }
    );
});
