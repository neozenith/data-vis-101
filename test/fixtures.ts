'use strict';
import http from 'http';
import { after, before } from 'mocha';
import path from 'path';
import { DockerReady, isMongoReady } from './docker-ready';

const fixture = new DockerReady();
fixture.learn('mongodb', isMongoReady);

const TIMEOUT = 1 * 60 * 1000; // ms
const PROJECT = path.basename(process.cwd());

before(async function() {
  this.timeout(TIMEOUT);

  const serviceTargets = [
    {protocol: 'mongodb', name: '/mongo', privatePort: 27017}
  ];

  await fixture.setupDocker(PROJECT, serviceTargets);

});

after(async function() {
  this.timeout(TIMEOUT);

  if (process.env.TEST_MODE && process.env.TEST_MODE !== 'WATCH') {
    await DockerReady.runProcess('docker-compose down');
  }
});
