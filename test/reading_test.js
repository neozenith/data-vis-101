'use strict';
const supertest = require('supertest');
let api = null;

describe('Reading', function() {
  this.timeout(0);

  before('setup', function() {
    const TEST_HOST = process.env.TEST_HOST || 'http://localhost:3000';
    console.log({ TEST_HOST });
    api = supertest(TEST_HOST);
  });

  it('200 /reading', function(done) {
    api
      .get('/api/v1/reading')
      .expect(200)
      .end(done);
  });
});
