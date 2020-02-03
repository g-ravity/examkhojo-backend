const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: {
    type: {
      city: String,
      state: String
    },
    required: true
  },
  type: { type: String, required: true },
  approval: { type: String, required: true },
  logo: { type: String, default: null },
  website: { type: String, default: null },
  brochure: { type: String, default: null },
  courses: { type: [mongoose.Schema.Types.ObjectId] }
});

const College = mongoose.model("college", collegeSchema);

module.exports = College;
