'use strict';

import mongoose from 'mongoose';
import logger from './logger';
const mongo_uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const options = {
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 100
};
// TODO: Make this actually retry until it works to be event driven
// TODO: https://www.npmjs.com/package/node-docker-api
// Use a docker API to drive starting up for tests.
// setTimeout(function() {
// logger.info('MongoDB startup...');
// mongoose
// .connect(
// mongo_uri,
// options
// )
// .then(() => logger.info('Mongo Successfully connected!!!'))
// .catch(e => logger.error('Mongo Connection Error'));
// }, 3000);
//
const db = mongoose.connection;
// db.on('error', e => logger.error('Mongo DB connection error'));
// db.once('open', () => logger.info('Successfully logged to MongoDB'));
//
// db.on('connected', () => logger.info('Connected'));
// db.on('disconnecting', () => logger.warn('MongoDb is disconnecting'));
// db.on('disconnected', () => logger.warn('MongoDb is disconnected'));
// db.on('reconnected', () => logger.warn('MongoDb is reconnected'));
// db.on('timeout', e => logger.warn('MongoDb timeout'));
// db.on('close', () => logger.warn('MongoDb connection closed'));
//
// logger.info('MongoDB startup finished.');
//
export default db;
