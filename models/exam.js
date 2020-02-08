const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  website: { type: String, required: true },
  duration: { type: String, required: true },
  date: { type: String, required: true },
  conductingBody: { type: String, required: true },
  level: { type: String, required: true }
});

const Exam = mongoose.model("exam", examSchema);

module.exports = Exam;
