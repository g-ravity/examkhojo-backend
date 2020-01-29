const mongoose = require("mongoose");

const superUserSchema = new mongoose.Schema({
  userType: { type: String, enum: ["admin", "manager"], required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
});

const SuperUser = mongoose.model("superUser", superUserSchema);

module.exports = SuperUser;
