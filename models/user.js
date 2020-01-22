const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { required: true, type: String },
  email: { required: true, type: String, unique: true },
  password: { required: true, type: String },
  googleId: { type: String, default: null },
  facebookId: { type: String, default: null },
  registrationSlug: { type: String, default: null },
  phone: String,
  college: String,
  exam: String,
  profilePicture: { type: String, default: null }
});

const User = mongoose.model("user", userSchema);

export default User;
