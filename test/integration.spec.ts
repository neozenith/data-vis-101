import { after, before, describe, it } from 'mocha';
import supertest from 'supertest';
import { shutdown, startup } from '../src/server/app';

let api: supertest.SuperTest<supertest.Test>;

describe('Authenticating API requests', function() {
  this.timeout(0);

  before(async function() {
    api = supertest(await startup());
  });

  after(async function() {
    await shutdown('Test Finished');
  });

  it('GET / 200 OK', function(done) {
    api
      .get('/')
      .expect(200)
      .end(done);
  });

});
