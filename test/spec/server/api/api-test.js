'use strict';
/* jshint -W098 */

var request = require('supertest'),
    path = require('path'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    should = require('chai').should();

function checkResponseHasThreeBulletins(response) {
    if (response.body.length !== 3) {
        return 'Expected 3 bulletins, instead got ' + response.body.length;
    }
}

describe('Bulletin API', function() {
    // Setup test data.
    before(function(done) {
        // Set default node environment to development
        process.env.NODE_ENV = process.env.NODE_ENV || 'development';

        // Application Config
        var config = require('../../../../lib/config/config');

        // Connect to database
        mongoose.connect(config.mongo.uri, config.mongo.options);

        // Bootstrap models
        var modelsPath = path.join(config.root, 'lib/models');
        fs.readdirSync(modelsPath).forEach(function (file) {
            if (/(.*)\.js$/.test(file)) {
                require(modelsPath + '/' + file);
            }
        });

        // Populate empty DB with test data
        var configPath = path.join(config.root, 'lib/config');
        var testBulletins = require(configPath + '/dummydata').initBulletins;
        testBulletins(done);
    });

    describe('GET /api/bulletins/all', function() {
        var bulletins;

        it('should return 3 bulletin JSON objects', function(done) {
            request('http://localhost:9000')
                .get('/api/bulletins/all')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(checkResponseHasThreeBulletins)
                .expect(200)
                .end(function(err, response) {
                    if (err) {
                        return done(err);
                    }
                    bulletins = response.body;
                    done();
                });
        });

        it('bulletins should have a title property', function() {
            for (var i = 0; i < bulletins.length; i++) {
                bulletins[i].should.have.property('title');
            }
        });

        it('bulletins should have a text property', function() {
            for (var i = 0; i < bulletins.length; i++) {
                bulletins[i].should.have.property('text');
            }
        });

        it('should be possible to add new bulletins by sending JSON POST to /api/bulletins', function(done) {
            request('http://localhost:9000')
                .post('/api/bulletins/create')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send({title:'Test bulletin',text:'Test text'})
                .expect(201)
                .end(function(err) {
                        if (err) {
                            return done(err);
                        }
                        done();
                    });
        });

        it('should validate title for length and return 400 on too long titles', function(done) {
            request('http://localhost:9000')
                .post('/api/bulletins/create')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send({title:'12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901', // 101 chars
                       text:'Test text'})
                .expect(400)
                .end(function(err) {
                        if (err) {
                            return done(err);
                        }
                        done();
                    });
        });

        it('should validate text for length and return 400 on too long texts', function(done) {
            request('http://localhost:9000')
                .post('/api/bulletins/create')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send({title:'Title',
                       text:'123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901'}) // 2001 chars
                .expect(400)
                .end(function(err) {
                        if (err) {
                            return done(err);
                        }
                        done();
                    });
        });
    });
});
