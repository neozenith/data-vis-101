'use strict';
const http = require('http');
const { exec } = require('child_process');

const TIMEOUT = 1 * 60 * 1000; //ms

before(async function() {
  this.timeout(TIMEOUT);
  console.log('BEFORE:');
  await runProcess('docker-compose up --build -d');
  const containers = await queryDocker('/containers/json');

  //extract container information
  const services = containers.map(container => {
    return {
      id: container.Id,
      name: container.Names[0],
      image: container.Image,
      ports: container.Ports,
      state: container.State,
      status: container.Status
    };
  });

  //TODO: Connectivity checks
  // https://stackoverflow.com/a/37576787/622276
  await Promise.all(
    services.map(async service => {
      return new Promise((resolve, reject) => {
        // Integrate Async service check here
        resolve();
      });
    })
  );
  console.log(services);
});

after(async function() {
  this.timeout(TIMEOUT);
  console.log('AFTER:');
  await runProcess('docker-compose down');
});

/**
 * Exceute a child process as a promise
 *
 * @param {string} command - Command process to execute asynchronously
 *
 * @return {Promise} Promise will return stdout/stderr streams
 */
function runProcess(command) {
  // Return a promise to run this child process but do no start running it.
  return new Promise((resolve, reject) => {
    // child_process.exec will create a ChildProcess Object to queue up this
    // process to execute like setTimeout(fn, 0)
    // but because this function call has not completed we can attach the eventHandlers
    // once the queued ChildProcess starts running, the event handlers will
    // log as output occurs.
    // Finally the child_process callback will resolve the outer promise that
    // we kicked off when the ChildProcess exits
    const child_proc = exec(command, (err, stdout, stderr) => {
      if (err) {
        reject({ error: err, stdout: stdout, stderr: stderr });
      } else {
        resolve({ stdout: stdout, stderr: stderr });
      }
    });

    child_proc.stdout.on('data', data => console.log('>> ' + data.toString()));
    child_proc.stderr.on('data', data => console.error('>> ' + data.toString()));
  });
}

/**
 * Run queries against the Docker API and return JSON object
 *
 * @param {string} path     - Request path for Docker engine API.
 *    See also https://docs.docker.com/engine/api/latest/
 * @param {Object} options  - Optional Object of options to configure http request to Unix Socket.
 *    See also https://nodejs.org/api/http.html#http_http_request_options_callback
 *
 * @return {Promise} - Promise resolves to JSON parsed Object from Docker Engine query.
 *
 */
function queryDocker(path, options) {
  const api = `v1.37`;
  // https://docs.docker.com/engine/api/v1.37/
  // Initialise sane defaults for querying docker and
  // merge with optional user provided options
  const _options = Object.assign(
    {
      socketPath: '/var/run/docker.sock',
      path: `http://${api}${path}`
    },
    options
  );

  // Create a promise that will query Docker and aggregate the result as JSON.
  return new Promise((resolve, reject) => {
    // Define output string accumulator
    let output = '';
    //Define callback that prepares eventHandlers
    const callback = res => {
      res.setEncoding('utf8');
      res.on('data', data => (output += data));
      res.on('error', data => reject(data));
      res.on('close', () => resolve(JSON.parse(output)));
    };

    //Trigger compose request and call .end() to trigger.
    const clientRequest = http.request(_options, callback);
    clientRequest.end();
  });
}
