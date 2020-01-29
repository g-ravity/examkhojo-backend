const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    type: {
      city: String,
      state: String
    },
    default: null,
    required: true
  },
  logo: { type: String, default: null },
  website: { type: String, default: null },
  brochure: String,
  courses: { type: [mongoose.Schema.Types.ObjectId] }
});

const College = mongoose.model("college", collegeSchema);

module.exports = College;
