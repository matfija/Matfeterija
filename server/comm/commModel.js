'use strict';

const mongoose = require('mongoose');

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

// After okidac za dodavanje komentara;
// uz svaki se povecava brojac na objavi
commSchema.post('save', async function (doc, next) {
  try {
    const Post = require('../post/postModel');
    await Post.findByIdAndUpdate(
      doc.post,
      { $inc: { comms: 1 } }
    );
    next();
  } catch (err) {
    next(err);
  }
});

// After okidac za brisanje komentara;
// uz svaki se smanjuje brojac na objavi
commSchema.post('remove', async function (doc, next) {
  try {
    const Post = require('../post/postModel');
    await Post.findByIdAndUpdate(
      doc.post,
      { $inc: { comms: -1 } }
    );
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Comm', commSchema);
