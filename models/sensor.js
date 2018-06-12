'use strict';
const mongoose = require('mongoose');
const validator = require('validator');
const schema = new mongoose.Schema({
  name: String,
  model: {
    type: String,
    required: true,
    lowercase: true,
    validate: value => {
      return validator.isAlphanumeric(value);
    }
  },
  manufacturer: String,
  serial: String
});
module.exports = mongoose.model('sensor', schema);
