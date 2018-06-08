'use strict';

const express = require('express');
const router = express.Router();
const { initMongoRoute } = require('./mongo-route-template');

// Define named list of collections
const collections = ['sensor'];

//Iterate through initialising them
collections.forEach(c => {
  initMongoRoute(router, c);
});

module.exports = router;
