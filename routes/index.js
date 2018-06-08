'use strict';

const express = require('express');
const router = express.Router();
const { initMongoRoute } = require('./mongo-route-template');

initMongoRoute(router, 'sensor');
// initMongoRoute(router, 'anothercollection');

module.exports = router;
