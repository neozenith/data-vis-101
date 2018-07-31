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

  // STEP #1: Check if containers are already running for this project
  let containers: any = await DockerReady.getComposedContainers(PROJECT);

  // STEP #2: Docker Compose to setup resources
  if (containers.length <= 0) {
   await DockerReady.runProcess('docker-compose up --detach mongo');
  }
  // STEP #3: Create Service URLs from container information
  containers = await DockerReady.getComposedContainers(PROJECT);

  const serviceUrls = [
    // `http://localhost:${DockerReady.findPublicPort(containers, '/app', 8888)}`,
    `mongodb://localhost:${DockerReady.findPublicPort(containers, '/mongo', 27017)}`
  ];

  // STEP #4: readyYet checks for successful ping of serviceUrls;
  await fixture.allReadyYet(serviceUrls);
});

after(async function() {
  this.timeout(TIMEOUT);

  if (process.env.TEST_MODE && process.env.TEST_MODE !== 'WATCH') {
    await DockerReady.runProcess('docker-compose down');
  }
});
