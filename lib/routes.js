'use strict';

var index = require('./controllers'),
    users = require('./controllers/users'),
    session = require('./controllers/session'),
    bulletins = require('./controllers/bulletins');

var middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function(app) {

    // Bulletin API routes
    app.get('/api/bulletins/', middleware.auth, bulletins.all);
    app.post('/api/bulletins/', [middleware.auth, middleware.validateProperties], bulletins.create);
    app.get('/api/bulletins/:id', [middleware.auth, middleware.hasId], bulletins.get);
    app.del('/api/bulletins/:id', [middleware.auth, middleware.hasId], bulletins.delete);
    app.put('/api/bulletins/:id', [middleware.auth, middleware.hasId, middleware.validateProperties], bulletins.update);

    // User API routes
    app.post('/api/users', users.create);
    app.put('/api/users', users.changePassword);
    app.get('/api/users/me', users.me);
    app.get('/api/users/:id', users.show);

    app.post('/api/session', session.login);
    app.del('/api/session', session.logout);

    // All undefined api routes should return a 404
    app.get('/api/*', function(req, res) {
        res.send(404);
    });

    // Catch other HTTP verbs and return 405.
    app.all('/api/*', function(req, res) {
        res.send(405);
    });

    // All other routes to use Angular routing in app/scripts/app.js
    app.get('/partials/*', index.partials);
    app.get('/*', middleware.setUserCookie, index.index);
};
