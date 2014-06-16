'use strict';

var mongoose = require('mongoose'),
    Bulletin = mongoose.model('Bulletin'),
    bulletinService = require('../services/bulletin-service');

/**
 *  Get all bulletins
 */
exports.all = function (req, res) {
    bulletinService.all()
        .then(function (bulletins) {
            res.send(200, bulletins);
        }, function() {
            res.send(500);
        });
};

exports.get = function (req, res) {
    bulletinService.get(req.route.params.id)
        .then(function (bulletin) {
            res.json(200, bulletin);
        }, function (err) {
            if (/Invalid ID/.test(err) || /Bulletin not found/.test(err)) {
                res.send(404);
            } else {
                res.send(400);
            }
        });
};

exports.create = function (req, res) {
    bulletinService.create(new Bulletin(req.body))
        .then(function (hashedId) {
            res.set('Location', '/api/bulletins/' + hashedId);
            res.send(201);
        }, function () {
            res.send(400);
        });
};

exports.delete = function (req, res) {
    bulletinService.delete(req.route.params.id)
        .then(function() {
            res.send(204);
        }, function (err) {
            if (/Invalid ID/.test(err) || /Bulletin not found/.test(err)) {
                res.send(404);
            } else {
                res.send(400);
            }
        });
};

exports.update = function (req, res) {
    bulletinService.update(req.route.params.id,
        {
            title: req.body.title,
            text: req.body.text
        })
        .then(function (hashedId) {
            res.set('Location','/api/bulletins/' + hashedId);
            res.send(303);
        }, function (err) {
            if (/Invalid ID/.test(err) || /Bulletin not found/.test(err)) {
                res.send(404);
            } else {
                res.send(400);
            }
        });
};
