const express = require("express");
const _ = require("lodash");

const router = express.Router();
const Exam = require("../models/exam");

router.post("/", async (req, res) => {
  try {
    let exam = await Exam.findOne({ name: req.body.name });
    if (exam) return res.status(400).send("Exam already exists");
    exam = new Exam(req.body);
    exam = await exam.save();
    return res
      .status(200)
      .send(_.pick(exam, ["name", "date", "id", "conductingBody", "level"]));
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get("/", async (req, res) => {
  try {
    let examList = await Exam.find({});
    examList = _.map(examList, exam =>
      _.pick(exam, ["name", "date", "id", "conductingBody", "level"])
    );
    return res.status(200).send(_.reverse(examList));
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    return res
      .status(200)
      .send(
        _.pick(exam, [
          "name",
          "date",
          "id",
          "conductingBody",
          "level",
          "website",
          "duration"
        ])
      );
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);
    return res.status(200).send("Successfully deleted!");
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    let exam = await Exam.findById(req.params.id);
    exam.set(req.body);
    exam = await exam.save();
    return res
      .status(200)
      .send(_.pick(exam, ["name", "date", "id", "conductingBody", "level"]));
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
