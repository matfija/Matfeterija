'use strict';

const mongoose = require('mongoose');

const Comm = require('../comm/commModel');

// Shema objave u bazi
const postSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  topics: [{
    type: String
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

// Opadajuci indeks nad datumom
postSchema.index({ date: -1 });

// Before okidac za brisanje objave;
// brisanje svih komentara uz objavu
postSchema.pre('remove', async function (next) {
  try {
    await Comm.deleteMany({
      post: this._id
    });
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Post', postSchema);
