'use strict';

var mongoose = require('mongoose'),
    Bulletin = mongoose.model('Bulletin'),
    Hashids = require('hashids');

var ERROR_INVALID_ID = {'message': 'Invalid ID'};
var ERROR_NOT_FOUND = {'message': 'Bulletin not found'};

function decryptId(hashedId) {
    var hashids = new Hashids(process.env.HASH_ID_SALT);
    var id = hashids.decryptHex(hashedId);

    if (!id) {
        return null;
    }

    return id;
}

exports.all = function (callback) {
    Bulletin.find(function (err, bulletins) {
        if (err) {
            return callback(err);
        }

        if (!bulletins) {
            return callback(null, []);
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

exports.get = function (hashedId, callback) {
    var id = decryptId(hashedId);
    if (id === null) {
        return callback(ERROR_INVALID_ID);
    }

    Bulletin.findOne({_id:id}, function(err, bulletin) {
        if (err) {
            return callback(err);
        }

        if (!bulletin) {
            return callback(ERROR_NOT_FOUND);
        }

        var hashids = new Hashids(process.env.HASH_ID_SALT);

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
    var id = decryptId(hashedId);
    if (id === null) {
        return callback(ERROR_INVALID_ID);
    }

    Bulletin.remove({_id:id}, function(err, numOfBulletinsDeleted) {
        if (err) {
            return callback(err);
        }

        if (numOfBulletinsDeleted === 0) {
            return callback(ERROR_NOT_FOUND);
        }

        callback(null);
    });
};

exports.update = function (hashedId, content, callback) {
    var id = decryptId(hashedId);
    if (id === null) {
        return callback(ERROR_INVALID_ID);
    }

    Bulletin.findOne({_id:id}, function(err, b) {
        if (err) {
            return callback(err);
        }

        if (!b) {
            return callback(ERROR_NOT_FOUND);
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

            var hashids = new Hashids(process.env.HASH_ID_SALT);
            callback(null, hashids.encryptHex(b._id));
        });
    });
};
