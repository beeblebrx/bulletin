'use strict';

var request = require('supertest');

describe('users API', function() {
    it('should return something when we GET /api/users/me', function(done) {
        request('http://localhost:9000')
            .get('/api/users/me')
            .set('Accept', 'application/json')
            .expect(200, done);
    });
});
