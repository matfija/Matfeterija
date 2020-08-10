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
  }
}, { versionKey: false });

// Slozeni indeks nad temom i datumom
commSchema.index({ post: 1, date: -1 });

module.exports = mongoose.model('Comm', commSchema);