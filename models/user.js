const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: { required: true, type: String },
  email: { required: true, type: String, unique: true },
  password: { type: String, default: null },
  googleId: { type: String, default: null },
  facebookId: { type: String, default: null },
  registrationSlug: { type: String, required: true },
  phone: String,
  college: String,
  exam: String,
  profilePicture: { type: String, default: null }
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ id: this.id }, config.get("jwtPrivateKey"));
  return token;
};

const User = mongoose.model("user", userSchema);

const validateUser = user => {
  const schema = Joi.object({
    name: Joi.string()
      .required()
      .label("Name is required"),
    email: Joi.string()
      .regex(
        /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
      )
      .required()
      .label("Invalid Email"),
    password: Joi.string()
      .min(8)
      .required()
      .label("Password must be 8 characters long"),
    registrationSlug: Joi.string()
      .required()
      .label("Registration Slug is required")
  });

  return schema.validate(user);
};

module.exports = {
  User,
  validateUser
};
