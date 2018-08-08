'use strict';

import express from 'express';
const router = express.Router();
import { initMongoRoute } from './mongo-route-template';

// const SensorModel = require('../models/sensor');
// const ReadingModel = require('../models/reading');
//
// Define named list of collections
// const models = [SensorModel, ReadingModel];

// Iterate through initialising them
// models.forEach(m => {
// initMongoRoute(router, m);
// });

module.exports = router;
