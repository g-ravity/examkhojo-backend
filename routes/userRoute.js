const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");

const verifyUser = require("../middleware/verifyUser");
const Exam = require("../models/exam");
const College = require("../models/college");
const Course = require("../models/course");

const router = express.Router();

const getModel = model => {
  switch (model) {
    case "exam":
      return Exam;
    case "college":
      return College;
    case "course":
      return Course;
    default:
      return null;
  }
};

router.get("/", verifyUser, (req, res) => {
  return res.status(200).send(req.user.name);
});

router.post("/bookmarks", verifyUser, async (req, res) => {
  const { bookmarkId } = req.body;
  let isBookmarked = false;
  _.forEach(req.user.bookmarks, val => {
    if (String(val.bookmarkId) === bookmarkId) {
      isBookmarked = true;
      return;
    }
  });
  if (!isBookmarked) {
    req.user.set({ bookmarks: [...req.user.bookmarks, req.body] });
    const user = await req.user.save();
    const item = user.bookmarks.pop();
    const Model = getModel(item.bookmarkType);
    const bookmarkedItem = await Model.findById(item.bookmarkId);
    return res.status(200).send(bookmarkedItem);
  } else return res.status(400).send("Item already bookmarked");
});

router.get("/bookmarks", verifyUser, async (req, res) => {
  let examBookmarks = _.filter(
    req.user.bookmarks,
    val => val.bookmarkType === "exam"
  );
  let collegeBookmarks = _.filter(
    req.user.bookmarks,
    val => val.bookmarkType === "college"
  );
  let courseBookmarks = _.filter(
    req.user.bookmarks,
    val => val.bookmarkType === "course"
  );

  examBookmarks = await Exam.find({
    _id: {
      $in: _.map(examBookmarks, val => mongoose.Types.ObjectId(val.bookmarkId))
    }
  });
  examBookmarks = _.map(examBookmarks, course =>
    _.pick(course, ["name", "date", "id", "conductingBody", "level"])
  );
  collegeBookmarks = await College.find({
    _id: {
      $in: _.map(collegeBookmarks, val =>
        mongoose.Types.ObjectId(val.bookmarkId)
      )
    }
  });
  collegeBookmarks = _.map(collegeBookmarks, course =>
    _.pick(course, ["name", "id", "location", "approval", "type"])
  );
  courseBookmarks = await Course.find({
    _id: {
      $in: _.map(courseBookmarks, val =>
        mongoose.Types.ObjectId(val.bookmarkId)
      )
    }
  });
  courseBookmarks = _.map(courseBookmarks, course =>
    _.pick(course, ["name", "duration", "id", "stream", "level"])
  );
  return res
    .status(200)
    .send({ examBookmarks, collegeBookmarks, courseBookmarks });
});

router.delete("/bookmarks/:id", verifyUser, async (req, res) => {
  const bookmarks = _.filter(
    req.user.bookmarks,
    val => String(val.bookmarkId) !== req.params.id
  );
  req.user.set({ bookmarks });
  await req.user.save();
  return res.status(200).send("Bookmark successfully removed!");
});

module.exports = router;
