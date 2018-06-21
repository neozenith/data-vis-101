'use strict';

const path = require('path');
const { DockerFixture } = require('./docker_fixture.js');
const PROJECT = path.basename(process.cwd()); // Get current directory as project name

const fixture = new DockerFixture();

const TIMEOUT = 1 * 60 * 1000; //ms
before(async function() {
  this.timeout(TIMEOUT);

  // STEP #1: Docker Compose to setup resources
  await fixture.runProcess('docker-compose up --build -d');

  // STEP #2: Create Service URLs from container information
  const containers = await fixture.queryDocker(`/containers/json?label="com.docker.compose.project=${PROJECT}"`);
  const serviceUrls = containers.map(container => {
    let output = '';
    switch (container.Names[0]) {
      case '/app':
        output = `http://localhost:${container.Ports[0].PublicPort}`;
        //supertest expects this to be set
        process.env.TEST_HOST = output;
        break;
      case '/mongo':
        output = `mongo://localhost:${container.Ports[0].PublicPort}`;
        break;
    }
    return output;
  });

  // STEP #3: readyYet checks for successful ping of service Urls
  await Promise.all(
    serviceUrls.map(async serviceUrl => {
      return fixture.readyYet(serviceUrl);
    })
  );
});

after(async function() {
  this.timeout(TIMEOUT);
  await fixture.runProcess('docker-compose down');
  await fixture.runProcess('docker container prune -f && docker image prune -f');
});