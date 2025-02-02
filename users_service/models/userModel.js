var mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  profilePictureId: { type: String, default: '679f3ddd44167687b51c34e4' },
  signature: { type: String, default: '' },
  joined: { type: Date, default: Date.now }
}, { collection: "users" });

const User = mongoose.model('User', userSchema);

module.exports = User;
