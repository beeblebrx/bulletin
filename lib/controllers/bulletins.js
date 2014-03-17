'use strict';

var mongoose = require('mongoose'),
    Bulletin = mongoose.model('Bulletin');
/**
 *  Get all bulletins
 */
exports.all = function (req, res) {
    Bulletin.find(function (err, bulletins) {
        if (err) {
            throw new Error('Fuuuuu');
        }

        res.send(bulletins);
    });
};
