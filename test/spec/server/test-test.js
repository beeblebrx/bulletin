'use strict';

var expect_ = require('chai').expect,
    request = require('supertest');

describe('Testi', function(){
    it('should not fail', function() {
        expect_(false).to.equal(false);
      });
  });

describe('users API', function() {
    it('should return something when we GET /api/users/me', function(done) {
        request('http://localhost:9000')
        .get('/api/users/me')
        .set('Accept', 'application/json')
        .expect(200, done);
      });
  });
