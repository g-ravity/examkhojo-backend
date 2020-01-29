const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fee: { type: Number, required: true },
  duration: { type: Number, required: true }
});

const Course = mongoose.model("course", courseSchema);

module.exports = Course;
