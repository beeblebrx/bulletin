'use strict';

var mongoose = require('mongoose'),
    Bulletin = mongoose.model('Bulletin'),
    Hashids = require('hashids');

exports.all = function (callback) {
    Bulletin.find(function (err, bulletins) {
        if (err) {
            return callback(err);
        }

        var hashids = new Hashids(process.env.HASH_ID_SALT);
        var responseBulletins = [];
        for (var i = 0; i < bulletins.length; i++) {
            responseBulletins[i] = {
                id: hashids.encryptHex(bulletins[i]._id),
                title: bulletins[i].title,
                text: bulletins[i].text
            };
        }

        callback(null, responseBulletins);
    });
};

exports.get = function (bulletinId, callback) {
    var hashids = new Hashids(process.env.HASH_ID_SALT);
    var id = hashids.decryptHex(bulletinId);

    Bulletin.findOne({_id:id}, function(err, bulletin) {
        if (err) {
            return callback(err);
        }

        callback(null,
            {
                id: hashids.encryptHex(bulletin._id),
                title: bulletin.title,
                text: bulletin.text
            });
    });
};

exports.create = function (bulletin, callback) {
    bulletin.save(function (err, b) {
        if (err) {
            return callback(err);
        }

        var hashids = new Hashids(process.env.HASH_ID_SALT);
        var hash = hashids.encryptHex(b._id);
        callback(null, hash);
    });
};

exports.delete = function (hashedId, callback) {
    var hashids = new Hashids(process.env.HASH_ID_SALT);
    var id = hashids.decryptHex(hashedId);

    Bulletin.remove({_id:id}, function(err) {
        if (err) {
            return callback(err);
        }

        callback(null);
    });
};

exports.update = function (hashedId, content, callback) {
    var hashids = new Hashids(process.env.HASH_ID_SALT);
    var id = hashids.decryptHex(hashedId);

    Bulletin.findOne({_id:id}, function(err, b) {
        if (err) {
            return callback(err);
        }

        if (content.title !== null && content.title !== undefined) {
            b.title = content.title;
        }
        if (content.text !== null && content.text !== undefined) {
            b.text = content.text;
        }

        b.save(function (err) {
            if (err) {
                return callback(err);
            }

            callback(null, hashids.encryptHex(b._id));
        });
    });
};
