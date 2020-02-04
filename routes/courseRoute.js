const express = require("express");
const _ = require("lodash");

const router = express.Router();
const Course = require("../models/course");

router.post("/", async (req, res) => {
  try {
    let course = await Course.findOne({ name: req.body.name });
    if (course) return res.status(400).send("Course already exists");
    course = new Course(req.body);
    course = await course.save();
    return res
      .status(200)
      .send(_.pick(course, ["name", "duration", "id", "stream", "level"]));
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get("/", async (req, res) => {
  try {
    let courseList = await Course.find({});
    courseList = _.map(courseList, course =>
      _.pick(course, ["name", "duration", "id", "stream", "level"])
    );
    return res.status(200).send(_.reverse(courseList));
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    return res
      .status(200)
      .send(
        _.pick(course, ["name", "duration", "id", "stream", "level", "fee"])
      );
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    return res.status(200).send("Successfully deleted!");
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    course.set(req.body);
    course = await course.save();
    return res
      .status(200)
      .send(_.pick(course, ["name", "duration", "id", "stream", "level"]));
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
