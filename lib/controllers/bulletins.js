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

exports.create = function (req, res) {
    var bulletin = new Bulletin(req.body);
    bulletin.save(function (err, bulletin) {
        if (err) {
            return res.json(400, err);
        }

        res.send(201);
    });
};
