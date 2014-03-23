'use strict';
/* jshint -W098 */

var request = require('supertest'),
    path = require('path'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    should = require('chai').should();

var HOST = 'http://localhost:9000';
var BULLETIN = {title:'Test bulletin',text:'Test text'};

function checkResponseHasThreeBulletins(response) {
    if (response.body.length !== 3) {
        return 'Expected 3 bulletins, instead got ' + response.body.length;
    }
}

function checkBulletin(response) {
    if (response.body.title !== BULLETIN.title  || response.body.text !== BULLETIN.text) {
        return 'Received bulletin does not match the one we sent!';
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
            request(HOST)
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
    });
    
    var createdBulletin;

    describe('POST /api/bulletins/create', function() {
        
        it('should create a new bulletin', function(done) {
            request(HOST)
                .post('/api/bulletins/create')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(BULLETIN)
                .expect(201)
                .end(function(err, res) {
                        if (err) {
                            return done(err);
                        }
                        createdBulletin = res.body.id;
                        createdBulletin.should.have.lengthOf(20);
                        done();
                    });
        });

        it('should validate bulletin title for length and return 400 on too long titles', function(done) {
            request(HOST)
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

        it('should validate bulletin text for length and return 400 on too long texts', function(done) {
            request(HOST)
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

    describe('GET /api/bulletins/:id', function() {
        it('should return the bulletin we created earlier', function(done) {
            request(HOST)
                .get('/api/bulletins/' + createdBulletin)
                .set('Content-Type', 'application/json')
                .expect(200)
                .expect('Content-Type', /json/)
                .expect(checkBulletin)
                .end(function(err) {
                    if (err) {
                        return done(err);
                    }

                    done();
                });
        });
    });

    describe('DELETE /api/bulletins', function() {

        it('should delete bulletins', function(done) {
            request(HOST)
                .del('/api/bulletins/' + createdBulletin)
                .expect(204)
                .end(function(err) {
                    if (err) {
                        return done(err);
                    }

                    done();
                });
        });
    });
});
