const mongoose = require('mongoose');

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
  }
}, { versionKey: false });

// Opadajuci indeks nad datumom
postSchema.index({ date: -1 });

module.exports = mongoose.model('Post', postSchema);
