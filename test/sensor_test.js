'use strict';
const supertest = require('supertest');
const TEST_HOST = process.env.TEST_HOST || 'http://localhost:3000';

const api = supertest(TEST_HOST);

describe('Sensor', function() {
  this.timeout(0);
  it('200 /sensor', function(done) {
    api
      .get('/api/v1/sensor')
      .expect(200)
      .end(done);
  });
});
