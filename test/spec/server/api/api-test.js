'use strict';
/* jshint -W098 */

var request = require('supertest'),
    path = require('path'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    should = require('chai').should();

var HOST = 'http://localhost:' + process.env.PORT;
var BULLETIN = {title:'Test bulletin',text:'Test text'};

function checkBulletinHasIdTitleAndText(bulletin) {
    /* jshint -W030 */
    bulletin.should.exist;
    /* jshint +W030 */
    bulletin.should.have.a.property('title');
    bulletin.should.have.a.property('text');
    bulletin.should.have.a.property('id');

    if (Object.getOwnPropertyNames(bulletin).length > 3) {
        throw new Error('The bulletin has too many properties!');
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

    describe('GET /api/bulletins/', function() {
        var bulletins;

        it('should return 3 bulletin JSON objects', function(done) {
            request(HOST)
                .get('/api/bulletins/')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, response) {
                    if (err) {
                        return done(err);
                    }

                    response.body.should.have.lengthOf(3);
                    bulletins = response.body;
                    done();
                });
        });

        it('should have an id, a title and a text property for each bulletin and nothing else', function() {
            /* jshint -W030 */
            bulletins.should.exist;
            /* jshint +W030 */
            for (var i = 0; i < bulletins.length; i++) {
                checkBulletinHasIdTitleAndText(bulletins[i]);
            }
        });
    });
    
    var createdBulletin;

    describe('POST /api/bulletins/', function() {
        
        it('should create a new bulletin and return 201 with Location header', function(done) {
            var locationRegex = /\/api\/bulletins\/(\w+)/;
            request(HOST)
                .post('/api/bulletins/')
                .set('Content-Type', 'application/json')
                .send(BULLETIN)
                .expect(201)
                .expect('Location', locationRegex)
                .end(function(err, res) {
                        if (err) {
                            return done(err);
                        }

                        var reg = locationRegex.exec(res.get('Location'));
                        createdBulletin = reg[1];
                        done();
                    });
        });

        it('should validate bulletin title for length and return 400 on too long titles', function(done) {
            request(HOST)
                .post('/api/bulletins/')
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
                .post('/api/bulletins/')
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

        it('should reject empty bulletin with 400', function(done) {
            request(HOST)
                .post('/api/bulletins/')
                .set('Content-Type', 'application/json')
                .send({})
                .expect(400)
                .end(function(err, res) {
                        if (err) {
                            return done(err);
                        }

                        done();
                    });
        });

        it('should reject invalid JSON with 400', function(done) {
            request(HOST)
                .post('/api/bulletins/')
                .set('Content-Type', 'application/json')
                .send('{"asdasdasasd"}')
                .expect(400)
                .end(function(err, res) {
                        if (err) {
                            return done(err);
                        }

                        done();
                    });
        });

        it('should reject bulletin JSON that has too many properties', function(done) {
            request(HOST)
                .post('/api/bulletins/')
                .set('Content-Type', 'application/json')
                .send({'title':'New bulletin', 'text':'Text', 'extra':'Extra property'})
                .expect(400)
                .end(function(err, res) {
                        if (err) {
                            return done(err);
                        }

                        done();
                    });
        });

        it('should reject bulletin JSON that has an invalid property', function(done) {
            request(HOST)
                .post('/api/bulletins/')
                .set('Content-Type', 'application/json')
                .send({'title':'New bulletin', 'texti':'Text'})
                .expect(400)
                .end(function(err, res) {
                        if (err) {
                            return done(err);
                        }

                        done();
                    });
        });

        it('should reject an attempt to create a bulletin with no JSON at all', function(done) {
            request(HOST)
                .post('/api/bulletins/')
                .set('Content-Type', 'application/json')
                .expect(400)
                .end(function(err, res) {
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
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }

                    res.body.should.have.a.property('id');
                    res.body.should.have.a.property('title');
                    res.body.should.have.a.property('text');
                    res.body.title.should.equal(BULLETIN.title);
                    res.body.text.should.equal(BULLETIN.text);
                    done();
                });
        });
    });

    describe('PUT /api/bulletins', function() {

        var updatedBulletinLocation1;
        it('should update bulletin title and return 303 with Location header', function(done) {
            request(HOST)
                .put('/api/bulletins/' + createdBulletin)
                .set('Content-Type', 'application/json')
                .send('{"title":"Updated title"}')
                .expect(303)
                .expect('Location', '/api/bulletins/' + createdBulletin)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }

                    updatedBulletinLocation1 = res.headers.location;
                    done();
                });
        });

        it('should have updated the bulletin title', function(done) {
            request(HOST)
                .get(updatedBulletinLocation1)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }

                    checkBulletinHasIdTitleAndText(res.body);
                    res.body.title.should.equal('Updated title');
                    done();
                });
        });

        var updatedBulletinLocation2;
        it('should update bulletin text and return 303 with Location header', function(done) {
            request(HOST)
                .put('/api/bulletins/' + createdBulletin)
                .set('Content-Type', 'application/json')
                .send('{"text":"Updated text"}')
                .expect(303)
                .expect('Location', '/api/bulletins/' + createdBulletin)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }

                    updatedBulletinLocation2 = res.headers.location;
                    done();
                });
        });

        it('should have updated the bulletin text', function(done) {
            request(HOST)
                .get(updatedBulletinLocation2)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }

                    checkBulletinHasIdTitleAndText(res.body);
                    res.body.text.should.equal('Updated text');
                    done();
                });
        });
    });

    describe('DELETE /api/bulletins', function() {

        it('should delete a bulletin', function(done) {
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

    describe('request to invalid URL', function() {
        it('should return 404 for GET when id is invalid', function(done) {
            request(HOST)
                .get('/api/bulletins/trolololol')
                .expect(404)
                .end(function(err) {
                    if (err) {
                        return done(err);
                    }

                    done();
                });
        });

        it('should return 404 for GET when id is unknown', function(done) {
            request(HOST)
                .get('/api/bulletins/3qxOznVBVqHwY2jPE6WZ')
                .expect(404)
                .end(function(err) {
                    if (err) {
                        return done(err);
                    }

                    done();
                });
        });

        it('should return 404 for PUT when id is invalid', function(done) {
            request(HOST)
                .put('/api/bulletins/trolololol')
                .set('Content-Type', 'application/json')
                .send('{"text":"Updated text"}')
                .expect(404)
                .end(function(err) {
                    if (err) {
                        return done(err);
                    }

                    done();
                });
        });

        it('should return 404 for PUT when id is unknown', function(done) {
            request(HOST)
                .put('/api/bulletins/3qxOznVBVqHwY2jPE6WZ')
                .set('Content-Type', 'application/json')
                .send('{"text":"Updated text"}')
                .expect(404)
                .end(function(err) {
                    if (err) {
                        return done(err);
                    }

                    done();
                });
        });

        it('should return 404 for DELETE when id is invalid', function(done) {
            request(HOST)
                .del('/api/bulletins/trolololol')
                .expect(404)
                .end(function(err) {
                    if (err) {
                        return done(err);
                    }

                    done();
                });
        });

        it('should return 404 for DELETE when id is unknown', function(done) {
            request(HOST)
                .del('/api/bulletins/3qxOznVBVqHwY2jPE6WZ')
                .expect(404)
                .end(function(err) {
                    if (err) {
                        return done(err);
                    }

                    done();
                });
        });
    });

    describe('call to /api/bulletins/ using wrong HTTP verbs', function() {

        it('should return 405 for PUT', function(done) {
            request(HOST)
                .put('/api/bulletins/')
                .send('{"title":"New bulletin", "text":"New text"}')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .expect(405)
                .end(function(err) {
                    if (err) {
                        return done(err);
                    }

                    done();
                });
        });

        it('should return 405 for DELETE', function(done) {
            request(HOST)
                .del('/api/bulletins/')
                .expect(405)
                .end(function(err) {
                    if (err) {
                        return done(err);
                    }

                    done();
                });
        });

        it('should return 3 bulletins', function(done) {
            request(HOST)
                .get('/api/bulletins/')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, response) {
                    if (err) {
                        return done(err);
                    }

                    response.body.should.have.lengthOf(3);
                    done();
                });
        });
    });

    describe('call to /api/bulletins/:id using wrong HTTP verbs', function() {
        var createdBulletin;

        before(function(done) {
            var locationRegex = /\/api\/bulletins\/(\w+)/;
            request(HOST)
                .post('/api/bulletins/')
                .set('Content-Type', 'application/json')
                .send(BULLETIN)
                .expect(201)
                .expect('Location', locationRegex)
                .end(function(err, res) {
                        if (err) {
                            return done(err);
                        }

                        var reg = locationRegex.exec(res.get('Location'));
                        createdBulletin = reg[1];
                        done();
                    });
        });

        it('should return 405 for POST', function(done) {
            request(HOST)
                .post('/api/bulletins/' + createdBulletin)
                .set('Content-Type', 'application/json')
                .send(BULLETIN)
                .expect(405)
                .end(function(err) {
                    if (err) {
                        return done(err);
                    }

                    done();
                });
        });

        it('should return 4 bulletins', function(done) {
            request(HOST)
                .get('/api/bulletins/')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, response) {
                    if (err) {
                        return done(err);
                    }

                    response.body.should.have.lengthOf(4);
                    done();
                });
        });
    });
});
