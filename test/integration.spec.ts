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
    await shutdown('Testing complete');
  });

  it('GET /ping 200 OK', function(done) {
    api
      .get('/ping')
      .expect(200)
      .expect(/pong/)
      .end(done);
  });
});
