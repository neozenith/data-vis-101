'use strict';
const mongoose = require('mongoose');
const Types = mongoose.Schema.Types;
const schema = new mongoose.Schema({
  sensor: Types.ObjectId,
  moisture: Number,
  temperature: Number,
  light: Number
});
module.exports = mongoose.model('Reading', schema);
