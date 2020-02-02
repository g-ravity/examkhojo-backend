const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const superUserSchema = new mongoose.Schema({
  userType: { type: String, enum: ["admin", "manager"], required: true },
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true }
});

const SuperUser = mongoose.model("superUser", superUserSchema);

const validateUser = user => {
  const schema = Joi.object({
    name: Joi.string()
      .required()
      .label("Name is required"),
    userType: Joi.string()
      .required()
      .valid("admin", "manager")
      .label("User Type must be one of [admin, manager]"),
    username: Joi.string()
      .required()
      .label("Username is required"),
    password: Joi.string()
      .min(8)
      .required()
      .label("Password must be 8 characters long")
  });

  return schema.validate(user);
};

module.exports = {
  SuperUser,
  validateUser
};
