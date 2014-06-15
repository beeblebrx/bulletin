'use strict';
var async = require('async');
var _ = require('lodash');

module.exports.dropCollections = function(mongoose, callback) {
    var collections = _.keys(mongoose.connection.collections);
    async.each(collections, function(collectionName, done) {
        var collection = mongoose.connection.collections[collectionName];
        collection.drop(function(err) {
            if (err && err.message !== 'ns not found') {
                done(err);
                return;
            }
            done();
        });
    }, callback);
};
