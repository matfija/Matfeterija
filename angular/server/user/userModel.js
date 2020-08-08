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

module.exports = mongoose.model('User', userSchema);
