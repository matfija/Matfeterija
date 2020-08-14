'use strict';

const mongoose = require('mongoose');

// Shema aktivnog korisnika u bazi
const activeSchema = mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  alas: {
    type: String,
    required: true
  },
  display: String,
  avatar: String,
  lastAction: {
    type: Date,
    default: Date.now
  }
});

// Jedinstveni indeks nad alasom
activeSchema.index({ alas: 1 }, { unique: true });

// TTL indeks nad poslednjom aktivnosti (30 min)
activeSchema.index({ lastAction: 1 }, { expireAfterSeconds: 1800 });

module.exports = mongoose.model('Active', activeSchema);
