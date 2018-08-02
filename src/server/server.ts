'use strict';
import os from 'os';
import throng from 'throng';
import { startup } from './app';

const CONCURRENCY = process.env.WEB_CONCURRENCY || os.cpus().length;

// TODO: Switch to log4js
import logger from './utils/logger';

function startMaster() {
  logger.info(`Master started, spanning ${throngOptions.workers} workers...`);
}

function startWorker(id) {
  logger.info(`Starting worker ${id}`);

  startup().then(
    () => {
      logger.info(`Worker ${id} successfully started`);
    },
    err => {
      logger.error(`Error during worker ${id} startup`);
    }
  );
}

const throngOptions = {
  workers: CONCURRENCY,
  lifetime: Infinity,
  master: startMaster,
  start: startWorker
};

throng(throngOptions);
