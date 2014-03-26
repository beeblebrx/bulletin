'use strict';

var mongoose = require('mongoose'),
    Bulletin = mongoose.model('Bulletin'),
    Hashids = require('hashids');

/**
 *  Get all bulletins
 */
exports.all = function (req, res) {
    Bulletin.find(function (err, bulletins) {
        if (err) {
            res.send(500);
        }

        res.send(bulletins);
    });
};

exports.get = function (req, res) {
    if (!req.route.params || !req.route.params.id) {
        return res.send(400);
    }

    var hashids = new Hashids();
    var id = hashids.decryptHex(req.route.params.id);

    Bulletin.findOne({_id:id}, function(err, bulletin) {
        if (err) {
            return res.send(400);
        }

        res.json(200, bulletin);
    });
};

exports.create = function (req, res) {
    var bulletin = new Bulletin(req.body);
    bulletin.save(function (err, b) {
        if (err) {
            return res.json(400);
        }

        var hashids = new Hashids();
        var hash = hashids.encryptHex(b._id);
        res.status(201);
        res.send({id: hash});
    });
};

exports.delete = function (req, res) {
    if (!req.route.params || !req.route.params.id) {
        return res.send(400);
    }

    var hashids = new Hashids();
    var id = hashids.decryptHex(req.route.params.id);

    Bulletin.remove({_id:id}, function(err) {
        if (err) {
            return res.send(400);
        }

        res.send(204);
    });
};
