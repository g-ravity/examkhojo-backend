const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  name: { type: String, required: true },
  website: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, required: true }
});

const Exam = mongoose.model("exam", examSchema);

export default Exam;
