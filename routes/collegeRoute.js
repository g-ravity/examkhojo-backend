const express = require("express");
const _ = require("lodash");

const router = express.Router();
const College = require("../models/college");

router.post("/", async (req, res) => {
  try {
    let college = await College.findOne({ name: req.body.name });
    if (college) return res.status(400).send("College already exists");
    college = new College(req.body);
    college = await college.save();
    return res
      .status(200)
      .send(_.pick(college, ["name", "id", "location", "approval", "type"]));
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get("/", async (req, res) => {
  try {
    let collegeList = await College.find({});
    collegeList = _.map(collegeList, college =>
      _.pick(college, ["name", "id", "location", "approval", "type"])
    );
    return res.status(200).send(_.reverse(collegeList));
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    console.log(college.location.city);
    return res
      .status(200)
      .send(
        _.pick(college, [
          "name",
          "id",
          "location",
          "approval",
          "type",
          "logo",
          "website",
          "brochure",
          "courses"
        ])
      );
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await College.findByIdAndDelete(req.params.id);
    return res.status(200).send("Successfully deleted!");
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    let college = await College.findById(req.params.id);
    college.set(req.body);
    college = await college.save();
    return res
      .status(200)
      .send(_.pick(college, ["name", "id", "location", "approval", "type"]));
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
