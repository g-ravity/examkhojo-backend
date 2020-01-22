const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  bookmarkType: {
    type: String,
    enum: ["exam", "college", "course"],
    required: true
  },
  bookmarkId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

const Bookmark = mongoose.model("bookmark", bookmarkSchema);

export default Bookmark;
