const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  fee: { type: String, required: true },
  duration: { type: Number, required: true },
  stream: { type: String, required: true },
  level: { type: String, required: true }
});

const Course = mongoose.model("course", courseSchema);

module.exports = Course;
