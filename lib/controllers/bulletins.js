'use strict';

var mongoose = require('mongoose'),
    Bulletin = mongoose.model('Bulletin'),
    bulletinService = require('../services/bulletin-service');

/**
 *  Get all bulletins
 */
exports.all = function (req, res) {
    bulletinService.all(function (err, bulletins) {
        if (err) {
            return res.send(500);
        }

        res.send(200, bulletins);
    });
};

exports.get = function (req, res) {
    if (!req.route.params || !req.route.params.id) {
        return res.send(400);
    }

    bulletinService.get(req.route.params.id, function (err, bulletin) {
        if (err) {
            return res.send(400);
        }

        res.json(200, bulletin);
    });
};

exports.create = function (req, res) {
    if (!req.body || Object.getOwnPropertyNames(req.body).length < 2) {
        return res.send(400);
    }

    var bulletin = new Bulletin(req.body);
    bulletinService.create(bulletin, function (err, hashedId) {
        if (err) {
            return res.send(400);
        }

        res.set('Location', '/api/bulletins/' + hashedId);
        res.send(201);
    });
};

exports.delete = function (req, res) {
    if (!req.route.params || !req.route.params.id) {
        return res.send(400);
    }

    bulletinService.delete(req.route.params.id, function (err) {
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

    bulletinService.update(req.route.params.id, {
        title: req.body.title,
        text: req.body.text
    }, function (err, hashedId) {
        if (err) {
            return res.json(500);
        }

        res.set('Location','/api/bulletins/' + hashedId);
        res.send(303);
    });
};
