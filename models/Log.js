const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  action: {
    type: String,
    required: true
  },
  details: {
    type: String
  },
  ip: String,
}, {
  timestamps: true
});

const Log = mongoose.model('Log', logSchema);
module.exports = Log;
