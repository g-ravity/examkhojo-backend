const express = require("express");
const bcrypt = require("bcryptjs");
const _ = require("lodash");

const router = express.Router();
const { SuperUser, validateUser } = require("../models/superUser");

router.post("/", async (req, res) => {
  const checkValid = validateUser(req.body);
  if (!checkValid.error) {
    let superUser = await SuperUser.findOne({ username: req.body.username });
    if (superUser) return res.status(400).send("Username already exists");
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      superUser = new SuperUser({
        name: req.body.name,
        username: req.body.username,
        password: hashedPassword,
        userType: req.body.userType
      });
      superUser = await superUser.save();
      return res.status(200).send({
        name: superUser.name,
        username: superUser.username,
        userType: superUser.userType
      });
    } catch (err) {
      return res.status(400).send("Something went wrong");
    }
  }
  return res.status(400).send(checkValid.error.details[0].context.label);
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const superUser = await SuperUser.findOne({ username });
    if (superUser) {
      const result = await bcrypt.compare(password, superUser.password);
      if (result)
        return res.status(200).send({
          name: superUser.name,
          username: superUser.username,
          userType: superUser.userType
        });
      return res.status(400).send("Incorrect Password");
    }
    return res.status(400).send("Username doesn't exist");
  } catch (err) {
    return res.status(400).send("Something went wrong");
  }
});

router.get("/managers", async (req, res) => {
  try {
    let managerList = await SuperUser.find({ userType: "manager" });
    managerList = _.map(managerList, manager =>
      _.pick(manager, ["name", "username", "userType"])
    );
    return res.status(200).send(managerList);
  } catch (err) {
    return res.status(500).send("Something went wrong!");
  }
});

router.delete("/:username", async (req, res) => {
  try {
    const superUser = await SuperUser.deleteOne({
      username: req.params.username
    });
    return res.status(200).send("Successfully deleted!");
  } catch (err) {
    return res.status(400).send("Something went wrong!");
  }
});

module.exports = router;
