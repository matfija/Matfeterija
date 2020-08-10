'use strict';

const mongoose = require('mongoose');

// Shema korisnika u bazi
const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  alas: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, { versionKey: false });

// Jedinstveni indeks nad imenom
userSchema.index({ alas: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
