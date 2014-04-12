'use strict';

var allowedProperties = require('./models/bulletin-properties').allowedProperties;

function isPropertyAllowed(key) {
    for (var i = 0; i < allowedProperties.length; i++) {
        if (allowedProperties[i] === key) {
            return true;
        }
    }

    return false;
}

/**
 * Custom middleware used by the application
 */
module.exports = {

    /**
     *  Protect routes on your api from unauthenticated access
     */
    auth: function auth(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.send(401);
    },

    /**
     * Set a cookie for angular so it knows we have an http session
     */
    setUserCookie: function(req, res, next) {
        if(req.user) {
            res.cookie('user', JSON.stringify(req.user.userInfo));
        }
        next();
    },

    validateProperties: function(req, res, next) {
        if (req.body) {
            for (var key in req.body) {
                if (!isPropertyAllowed(key)) {
                    return res.send(400);
                }
            }
            return next();
        } else {
            res.send(400);
        }
    },

    hasId: function(req, res, next) {
        if (!req.route.params || !req.route.params.id) {
            return res.send(400);
        }
        next();
    }
};
