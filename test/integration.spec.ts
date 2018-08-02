import { after, before, describe, it } from 'mocha';
import supertest from 'supertest';
import { shutdown, startup } from '../server/app';

let api: supertest.SuperTest<supertest.Test>;

describe('Authenticating API requests', function() {
  this.timeout(0);

  before(async function() {
    api = supertest(await startup());
  });

  after(async function() {
    await shutdown('SIGINT');
  });

  it('GET / 200 OK', function(done) {
    api
      .get('/')
      .expect(200)
      .end(done);
  });

  it('GET /vega.html 200 OK', function(done) {
    api
      .get('/vega.html')
      .expect(200)
      .end(done);
  });
});
