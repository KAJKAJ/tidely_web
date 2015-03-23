'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MemorialSchema = new Schema({
  admin_id: String,
  name: String,
  date_of_birth: Date,
  date_of_death: Date,
  expires_at: Date,
  file:{
  	location: String,
  	url: String,
  	updated_at: Date
  },
  timeline: {
    created: Boolean,
    era:[]
  },
  active: Boolean
});

module.exports = mongoose.model('Memorial', MemorialSchema);