'use strict';
const supertest = require('supertest');
let api = null;

describe('Sensor', function() {
  this.timeout(0);

  before('setup', function() {
    const TEST_HOST = process.env.TEST_HOST || 'http://localhost:3000';
    console.log({ TEST_HOST });
    api = supertest(TEST_HOST);
  });

  it('200 /sensor', function(done) {
    api
      .get('/api/v1/sensor')
      .expect(200)
      .end(done);
  });
});
