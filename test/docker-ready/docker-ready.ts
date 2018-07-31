'use strict';
import { exec } from 'child_process';
import http from 'http';
import url from 'url';

const handlers: any = {
  // Default handler
  http: (uri: string) => {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      http
        .get(uri, (res) => {
          const { statusCode } = res;
          // tslint:disable-next-line:no-console
          console.log(`${uri} ${statusCode}`);
          res.resume();
          resolve(res.statusCode === 200);
        })
        .on('error', (error) => {
          // tslint:disable-next-line:no-console
          console.error(error.message);
          resolve(false);
        });
    });
  }
};

/**
 * DockerReady class is used to eventfully trigger a docker test fixture to
 * startup, await ports, assist creating serviceURLs, await service URLs
 * to accept valid commands.
 */
export default class DockerReady {
  /**
   * Exceute a child process as a promise. eg
   * ```
   * await DockerReady.runProcess('docker-compose up --build -d');
   * await DockerReady.runProcess('docker-compose down');
   * ```
   *
   * @param {string} command - Command process to execute asynchronously
   *
   * @return {Promise} Promise will return stdout/stderr streams
   */
  public static runProcess(command: string) {
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
          reject({ error: err, stdout, stderr });
        } else {
          resolve({ stdout, stderr });
        }
      });

      child_proc.stdout.on('data', (data) => console.log('>> ' + data.toString()));
      child_proc.stderr.on('data', (data) => console.error('>> ' + data.toString()));
    });
  }

  /**
   * Shorthand to get containers for a docker compose project
   *
   * @param {string} project - The name of the docker compose project to filter on
   *
   * @return {Array[Objects]} Promise of Array of Objects decribing containers.
   * @see queryDocker
   */
  public static getComposedContainers(project: string): Promise<{}> {
    return this.queryDocker(`/containers/json?label="com.docker.compose.project=${project}"`);
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
  public static queryDocker(path: string, options?: any, api?: string): Promise<{}> {
    const _api = api || `v1`;
    // https://docs.docker.com/engine/api/v1.37/
    // Initialise sane defaults for querying docker and
    // merge with optional user provided options
    const _options = Object.assign(
      {
        path: `${path}`,
        socketPath: '/var/run/docker.sock'
      },
      options
    );

    // Create a promise that will query Docker and aggregate the result as JSON.
    return new Promise((resolve, reject) => {
      // Define output string accumulator
      let output = '';
      // Define callback that prepares eventHandlers
      const callback = (res: http.IncomingMessage) => {
        res.setEncoding('utf8');
        res.on('data', (data) => (output += data));
        res.on('error', (data) => reject(data));
        res.on('end', () => resolve(JSON.parse(output)));
      };

      // Trigger compose request and call .end() to trigger.
      const clientRequest = http.request(_options, callback);
      clientRequest.end();
    });
  }

  /**
   * Search through docker container listing for a container with a target name and
   * designated private port to find the exposed public port.
   * @param {any} containers - Listing of container information
   * @param {string} containerName - Name of container to search for
   * @param privatePort - Target service port internally exposed as a public port
   * @returns {number} The public port exposed for the `privatePort` of container named `containerName`
   */
  public static findPublicPort(containers: any, containerName: string, privatePort: number): number {
    return containers
      .find((container) => {
        return container.Names.includes(containerName);
      })
      .Ports.find( (port) => port.PrivatePort === privatePort )
      .PublicPort;
  }

  /**
   * Default constructor does nothing.
   * @return {void}
   */
  // tslint:disable-next-line:no-empty
  constructor() {}

   /**
    * This is to be used in conjunction with `readyYet`. DockerReady only knows
    * how to handle `http` by default. All other protocols will have to be `learn`t.
    *
    * ```
    * const {DockerReady} = require('./docker-ready');
    * const fixture = new DockerReady();
    * fixture.learn('mongo', url => {
    *    return new Promise((resolve, reject)=>{
    *      resolve(true);
    *    });
    * });
    * ```
    *
    * @param {string} protocol - URL protocol to associate this handler with.
    * @param {function} readyHandler - Function that accepts a single string argument `url`
    *  and returns a Promise that will return a boolean `true` is the service URL successfully
    *  connected and accepted a basic ping command.
    *
    * @return {void}
    */
  public learn(protocol: string, readyHandler: (url: string) => Promise<boolean>) {
    handlers[protocol] = readyHandler;
  }

  /**
   * Wraps `DockerReady.readyYet` in a Promise.all() for all `serviceUrls`
   *
   * @param {string[]} serviceUrls - Array of url strings to test
   * @return {Promise<Promise[]>}
   */
  public allReadyYet(serviceUrls: string[]) {
    return Promise.all(
      serviceUrls.map(async (serviceUrl) => {
        return this.readyYet(serviceUrl);
      })
    );
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
  public readyYet(uri: string, timeout?: number, interval?: number) {
    const _timeout = timeout || 10000; // ms
    const _interval = interval || 1000; // ms
    const _protocol: any = url.parse(uri).protocol.replace(/:/, '');

    return new Promise((resolve, reject) => {
      let finished: boolean = false;
      // Create interval check call back
      const interv: NodeJS.Timer = setInterval(async () => {
        // Check list of understood protocols
        if (_protocol in handlers) {
          console.debug(`checking ${uri}`);

          let ready = false;

          try {
            // Service URL handler should return false on connection failures
            ready = await handlers[_protocol](uri);
          } catch (error) {
            reject(error);
            return;
          }

          // Clear retry logic as soon as it is ready
          if (ready) {
            clearInterval(interv);
            finished = true;
            resolve();
          }
        } else {
          reject(new Error(`Unknown Service URL protocol: '${_protocol}'`));
        }
      }, _interval);

      // Create timeout to cap interval executions
      setTimeout(() => {
        if (!finished) {
          clearInterval(interv);
          finished = true;
          reject(new Error(`${uri} timed out after ${_timeout}ms`));
        }
      }, _timeout);
    });
  }
}
