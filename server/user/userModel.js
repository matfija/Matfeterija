'use strict';

const mongoose = require('mongoose');

const Post = require('../post/postModel');
const Comm = require('../comm/commModel');
const Active = require('../active/activeModel');

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
  },
  display: String,
  description: String,
  avatar: String,
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

// Jedinstveni indeks nad imenom
userSchema.index({ alas: 1 }, { unique: true });

// Brisanje svih objava i komentara uz korisnika
userSchema.pre('remove', async function (next) {
  try {
    await Post.deleteMany({
      user: this._id
    });
    await Comm.deleteMany({
      user: this._id
    });

    // Brisanje iz spiska aktivnih
    await Active.findByIdAndRemove(this._id);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', userSchema);
