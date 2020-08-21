'use strict';

const mongoose = require('mongoose');

const Post = require('../post/postModel');

// Shema komentara u bazi
const commSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
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
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

// Slozeni indeks nad temom i datumom
commSchema.index({ post: 1, date: -1 });

// Before okidac za dodavanje komentara;
// uz svaki se povecava brojac na objavi
commSchema.pre('save', async function () {
  await Post.findByIdAndUpdate(
    this.post,
    { $inc: { comms: 1 } },
    { session }
  );
});

// Before okidac za brisanje komentara;
// uz svaki se smanjuje brojac na objavi
commSchema.pre('remove', async function () {
  await Post.findByIdAndUpdate(
    this.post,
    { $inc: { comms: -1 } },
    { session }
  );
});

module.exports = mongoose.model('Comm', commSchema);
