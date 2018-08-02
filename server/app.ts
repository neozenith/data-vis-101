'use strict';

// Module Imports
import bodyParser from 'body-parser';
import compression from 'compression';
import express from 'express';
import morgan from 'morgan';
import path from 'path';

import logger from './utils/logger';

// Config

// Server Setup
const port = process.env.PORT || 3000;
const environment = process.env.NODE_ENV || 'development';
const staticPath = process.env.STATIC_PATH || path.join(__dirname, 'dist');
let httpServer;

/**
 * startupSystem() Defines the critical path setup of the API server
 *
 * @return {Promise} returns promise of `Express` App.
 */
function startup() {

  const app = express();
  app.use(morgan('dev'));
  app.use(compression());
  app.use(bodyParser.json());

  /*============================== SECURITY ============================== */

  // TODO: Incorporate passport.js

  /*============================== STATIC ASSETS ============================== */

  if (environment === 'development') {
    const webpack = require('webpack');
    const webpackMiddleware = require('webpack-dev-middleware');
    const webpackConfig = require('../webpack.config.js');
    webpackConfig.mode = environment;

    app.use(
      webpackMiddleware(webpack(webpackConfig), {
        publicPath: '/',
        stats: { colors: true }
      })
    );
  } else {
    logger.log(staticPath);
    app.use(express.static(staticPath));
  }

  /*============================== ROUTES============================== */
  app.use('/api/v1/', require('./routes'));

  /*============================== ERROR HANDLING ============================== */
  /* eslint-disable no-unused-vars */
  // 404
  app.use(function(req, res, next) {
    res.status(404).send('Not Found');
  });

  // 500
  app.use(function(err, req, res, next) {
    logger.error(err.stack);
    res.status(500).send('Internal Server Error: ' + err);
  });
  /* eslint-enable no-unused-vars */

  /*============================== PROCESS SHUTDOWN HANDLING ============================== */
  process.on('exit', code => {
    logger.info(`Application about to exit with code: ${code}`);
  });
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  // Serving
  // server start
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    httpServer = app.listen(port, () => {
      logger.log(`http://localhost:${port}`);
      resolve(app);
    });
  });
}

/**
 * shutdownSystem() Handler for cleaning up forked process and allocated resources
 *
 * @param {string} code - String code representing shutdown reason eg SIGINT, SIGTERM
 *
 * @return {Promise[]}
 */
function shutdown(code) {
  if (code) {
    logger.info(`${code} event received, application closing`);
  } else {
    logger.info(`Application closing`);
  }

  return Promise.all([
    new Promise(resolve => {
      if (httpServer) {
        logger.info('Express.js server closing');
        httpServer.close(() => resolve());
      } else {
        logger.warn('Express.js server NOT initialised !!!');
        resolve();
      }
    })
  ]).catch(err => {
    logger.error(err);
  });
}
// Export for Integration testing
export { startup, shutdown };
