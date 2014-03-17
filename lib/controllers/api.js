'use strict';

var mongoose = require('mongoose'),
    Bulletin = mongoose.model('Bulletin');

/**
 * Get awesome things
 */
exports.awesomeThings = function(req, res) {
    return Bulletin.find(function (err, things) {
        if (!err) {
            return res.json(things);
        } else {
            return res.send(err);
        }
    });
};
