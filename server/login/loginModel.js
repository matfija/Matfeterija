'use strict';

const mongoose = require('mongoose');

// Shema registracije u bazi
const loginSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  alas: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  authcode: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { versionKey: false });

// Jedinstveni indeks nad alasom
loginSchema.index({ alas: 1 }, { unique: true });

// Jedinstveni indeks nad kodom
loginSchema.index({ authcode: 1 }, { unique: true });

// TTL indeks nad datumom
loginSchema.index({ date: 1 }, { expireAfterSeconds: 60 });

module.exports = mongoose.model('Login', loginSchema);
