'use strict';

var mongoose = require('mongoose'),
    Bulletin = mongoose.model('Bulletin'),
    bulletinService = require('../services/bulletin-service'),
    codes = require('../constants/bulletin-codes').codes;

function handleErrors(res) {
    return function (err) {
        if (/Invalid ID/.test(err)) {
            res.send(codes.INVALID_ID);
        } else if (/Bulletin not found/.test(err)) {
            res.send(codes.BULLETIN_NOT_FOUND);
        } else {
            res.send(codes.BAD_BULLETIN);
        }
    };
}

/**
 *  Get all bulletins
 */
exports.all = function (req, res) {
    bulletinService.all()
        .then(function (bulletins) {
            res.send(codes.OK, bulletins);
        }, function() {
            res.send(codes.OTHER_ERROR);
        });
};

exports.get = function (req, res) {
    bulletinService.get(req.route.params.id)
        .then(function (bulletin) {
            res.json(codes.OK, bulletin);
        }, handleErrors(res));
};

exports.create = function (req, res) {
    bulletinService.create(new Bulletin(req.body))
        .then(function (hashedId) {
            res.set('Location', '/api/bulletins/' + hashedId);
            res.send(codes.BULLETIN_CREATED);
        }, function () {
            res.send(codes.BAD_BULLETIN);
        });
};

exports.delete = function (req, res) {
    bulletinService.delete(req.route.params.id)
        .then(function() {
            res.send(codes.BULLETIN_DELETED);
        }, handleErrors(res));
};

exports.update = function (req, res) {
    bulletinService.update(req.route.params.id,
        {
            title: req.body.title,
            text: req.body.text
        })
        .then(function (hashedId) {
            res.set('Location','/api/bulletins/' + hashedId);
            res.send(codes.BULLETIN_UPDATED);
        }, handleErrors(res));
};
