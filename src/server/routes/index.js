'use strict';

const express = require('express');
const router = express.Router();
const { initMongoRoute } = require('./mongo-route-template');

const SensorModel = require('../models/sensor');
const ReadingModel = require('../models/reading');
// Define named list of collections
const models = [SensorModel, ReadingModel];

//Iterate through initialising them
models.forEach(m => {
  initMongoRoute(router, m);
});

module.exports = router;
