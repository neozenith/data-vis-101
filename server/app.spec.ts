import { after, before, describe, it } from 'mocha';
import { shutdown, startup } from './app';

describe('Authenticating API requests', function() {
  it('Startup and shutdown', async function() {
    await startup();
    await shutdown();
  });
});
