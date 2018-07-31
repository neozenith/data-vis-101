'use strict';
import os from 'os';
import throng from 'throng';
import { startup } from './app';

const CONCURRENCY = process.env.WEB_CONCURRENCY || os.cpus().length;

// TODO: Switch to log4js
const logger = require('./utils/logger');

const throngOptions = {
  workers: CONCURRENCY,
  lifetime: Infinity,
  master: startMaster,
  start: startWorker
};

throng(throngOptions);

/**
 * This is invoked only once and is the main entry point for Throng
 * @return {void}
 **/
function startMaster() {
  logger.info(`Master started, spanning ${throngOptions.workers} workers...`);
}

/**
 * This is invoked for every worker process spawned by Throng
 *
 * @param {string} id The id for the worker process
 * @return {void}
 */
function startWorker(id) {
  logger.info(`Starting worker ${id}`);

  startup().then(
    () => {
      logger.info(`Worker ${id} successfully started`);
    },
    err => {
      logger.error(`Error during worker ${id} startup`, err);
    }
  );
}
