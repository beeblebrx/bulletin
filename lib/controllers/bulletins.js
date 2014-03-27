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

        var hashids = new Hashids();
        var responseBulletins = [];
        for (var i = 0; i < bulletins.length; i++) {
            responseBulletins[i] = {
                id: hashids.encryptHex(bulletins[i]._id),
                title: bulletins[i].title,
                text: bulletins[i].text
            };
        }

        res.send(200, responseBulletins);
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

        res.json(200,
            {
                id:hashids.encryptHex(bulletin._id),
                title:bulletin.title,
                text:bulletin.text
            });
    });
};

exports.create = function (req, res) {
    var bulletin = new Bulletin(req.body);
    bulletin.save(function (err, b) {
        if (err) {
            return res.send(400);
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

exports.update = function (req, res) {
    if (!req.route.params || !req.route.params.id || !req.body ||
        Object.getOwnPropertyNames(req.body).length === 0) {
        return res.send(400);
    }

    var hashedId = req.route.params.id;
    var hashids = new Hashids();
    var id = hashids.decryptHex(req.route.params.id);

    Bulletin.findOne({_id:id}, function(err, b) {
        if (err) {
            return res.send(400);
        }

        if (req.body.title !== null && req.body.title !== undefined) {
            b.title = req.body.title;
        }
        if (req.body.text !== null && req.body.text !== undefined) {
            b.text = req.body.text;
        }

        b.save(function (err) {
            if (err) {
                return res.json(500);
            }

            res.set('Location','/api/bulletins/' + hashedId);
            res.send(303);
        });
    });
};
