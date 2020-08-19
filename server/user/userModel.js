'use strict';

const fs = require('fs');
const path = require('path');
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
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

// Jedinstveni indeks nad imenom
userSchema.index({ alas: 1 }, { unique: true });

// Before okidac za brisanje korisnika
userSchema.pre('remove', async function (next) {
  try {
    // Brisanje svih objava uz korisnika
    (await Post.find({
      user: this._id
    })).forEach(async objava => {
      await objava.remove();
    });

    // Brisanje svih komentara uz korisnika
    await Comm.deleteMany({
      user: this._id
    });

    // Brisanje iz spiska aktivnih
    await Active.findByIdAndRemove(this._id);

    // Brisanje avatara ako je postojao
    const { avatar } = this;
    if (avatar) {
      const putanja = path.resolve(__dirname, '..', 'images',
        avatar.slice(avatar.lastIndexOf('/')+1));
      fs.unlinkSync(putanja);
    }
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', userSchema);
