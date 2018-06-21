'use strict';
const http = require('http');
const url = require('url');
const { exec } = require('child_process');

// TODO: this should be http only and everything else should be learned
const handlers = {
  'http:': function(uri) {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      http
        .get(uri, res => {
          const { statusCode } = res;
          console.log(`${uri} ${statusCode}`);
          res.resume();
          resolve(res.statusCode == 200);
        })
        .on('error', error => {
          console.error(error.message);
          resolve(false);
        });
    });
  },

  // eslint-disable-next-line no-unused-vars
  'mongo:': function(uri) {
    //TODO: check mongo and refactor
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }
};

class DockerFixture {
  constructor() {
    console.log('new instance');
  }

  learn(protocol, readyHandler) {
    handlers[protocol] = readyHandler;
  }
  /**
   * Exceute a child process as a promise. eg
   * ```
   * await DockerFixture.runProcess('docker-compose up --build -d');
   * await DockerFixture.runProcess('docker-compose down');
   * ```
   *
   * @param {string} command - Command process to execute asynchronously
   *
   * @return {Promise} Promise will return stdout/stderr streams
   */
  runProcess(command) {
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
   * @param {string} api - Optional string in form `vX.YY` to represent the targetted API version.
   *    Default v1.37
   *
   * @return {Promise} - Promise resolves to JSON parsed Object from Docker Engine query.
   *
   */
  queryDocker(path, options, api) {
    const _api = api || `v1.37`;
    // https://docs.docker.com/engine/api/v1.37/
    // Initialise sane defaults for querying docker and
    // merge with optional user provided options
    const _options = Object.assign(
      {
        socketPath: '/var/run/docker.sock',
        path: `http://${_api}${path}`
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

  /**
   * Takes a URI and tries pinging it for a given interval frequency or until timeout hit.
   * If a success result is returned before timeout it will resolve.
   *
   * @param {string} uri - Service URI to ping. Handler will be chosen based on URI protocol.
   * @param {integer} timeout - Amount of time in milliseconds to wait. Default 5000ms
   * @param {integer} interval - The period between retries in milliseconds. Default 1000ms
   *
   * @return {Promise} - Empty response, just resolves on success or rejects on timeout.
   */
  readyYet(uri, timeout, interval) {
    const _timeout = timeout || 5000; //ms
    const _interval = interval || 1000; //ms
    const _url = url.parse(uri);

    return new Promise((resolve, reject) => {
      // Create interval check call back
      let interv = setInterval(async () => {
        // Check list of understood protocols
        if (_url.protocol in handlers) {
          console.log(`checking ${uri}`);
          console.log(_url.protocol);

          let ready = false;

          try {
            ready = await handlers[_url.protocol](uri);
          } catch (error) {
            reject(error);
            return;
          }

          // Clear retry logic as soon as it is ready
          if (ready) {
            clearInterval(interv);
            interv = null;
            resolve();
          }
        } else {
          reject(new Error(`Service URL protocol unknown how to handle: ${_url.protocol}`));
        }
      }, _interval);

      // Create timeout to cap interval executions
      setTimeout(() => {
        if (interv) {
          clearInterval(interv);
          interv = null;
          reject(new Error(`${uri} timed out after ${_timeout}ms`));
        }
      }, _timeout);
    });
  }
}

module.exports = {
  DockerFixture
};