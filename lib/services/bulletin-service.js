'use strict';

var mongoose = require('mongoose'),
    Bulletin = mongoose.model('Bulletin'),
    Hashids = require('hashids'),
    Q = require('q');

var ERROR_INVALID_ID = 'Invalid ID';
var ERROR_NOT_FOUND = 'Bulletin not found';

function decryptId(hashedId) {
    var hashids = new Hashids(GLOBAL.APP_SETTINGS.idHashSalt);
    var id = hashids.decryptHex(hashedId);

    if (!id) {
        return null;
    }

    return id;
}

exports.all = function () {
    return Q.Promise(function (resolve, reject) {
        Bulletin.find(function (err, bulletins) {
            if (err) {
                reject(new Error(err));
            }

            if (!bulletins) {
                resolve([]);
            }

            var hashids = new Hashids(GLOBAL.APP_SETTINGS.idHashSalt);
            var responseBulletins = [];
            for (var i = 0; i < bulletins.length; i++) {
                responseBulletins[i] = {
                    id: hashids.encryptHex(bulletins[i]._id),
                    title: bulletins[i].title,
                    text: bulletins[i].text
                };
            }

            resolve(responseBulletins);
        });
    });
};

exports.get = function (hashedId) {
    return Q.Promise(function (resolve, reject) {
        var id = decryptId(hashedId);
        if (id === null) {
            reject(new Error(ERROR_INVALID_ID));
        } else {
            Bulletin.findOne({_id:id}, function(err, bulletin) {
                if (err) {
                    return reject(err);
                }

                if (!bulletin) {
                    return reject(new Error(ERROR_NOT_FOUND));
                }

                var hashids = new Hashids(GLOBAL.APP_SETTINGS.idHashSalt);

                resolve({
                        id: hashids.encryptHex(bulletin._id),
                        title: bulletin.title,
                        text: bulletin.text
                    });
            });
        }
    });
};

exports.create = function (bulletin) {
    return Q.Promise(function (resolve, reject) {
        bulletin.save(function (err, b) {
            if (err) {
                return reject(err);
            }

            var hashids = new Hashids(GLOBAL.APP_SETTINGS.idHashSalt);
            var hash = hashids.encryptHex(b._id);
            resolve(hash);
        });
    });
};

exports.delete = function (hashedId) {
    return Q.Promise(function(resolve, reject) {
        var id = decryptId(hashedId);
        if (id === null) {
            reject(new Error(ERROR_INVALID_ID));
        } else {
            Bulletin.remove({_id:id}, function(err, numOfBulletinsDeleted) {
                if (err) {
                    return reject(err);
                }

                if (numOfBulletinsDeleted === 0) {
                    return reject(new Error(ERROR_NOT_FOUND));
                }

                resolve();
            });
        }
    });
};

exports.update = function (hashedId, content) {
    return Q.Promise(function (resolve, reject) {
        var id = decryptId(hashedId);
        if (id === null) {
            reject(new Error(ERROR_INVALID_ID));
        } else {
            Bulletin.findOne({_id:id}, function(err, b) {
                if (err) {
                    return reject(err);
                }

                if (!b) {
                    return reject(new Error(ERROR_NOT_FOUND));
                }

                if (content.title !== null && content.title !== undefined) {
                    b.title = content.title;
                }
                if (content.text !== null && content.text !== undefined) {
                    b.text = content.text;
                }

                b.save(function (err) {
                    if (err) {
                        return reject(err);
                    }

                    var hashids = new Hashids(GLOBAL.APP_SETTINGS.idHashSalt);
                    resolve(hashids.encryptHex(b._id));
                });
            });
        }
    });
};
