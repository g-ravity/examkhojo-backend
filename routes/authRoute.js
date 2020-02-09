const express = require("express");
const bcrypt = require("bcryptjs");

const { User, validateUser } = require("../models/user");

const router = express.Router();

router.post("/register", async (req, res) => {
  const checkValid = validateUser(req.body);
  if (!checkValid.error) {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      });
      try {
        user = await user.save();
        const authToken = user.generateAuthToken();
        res.status(200).send({ name: user.name, token: authToken });
      } catch (err) {
        console.log("Error while registering user!");
      }
    } else res.status(400).send("User already exists");
  } else res.status(400).send(checkValid.error.details[0].context.label);
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (isValid) {
      const authToken = user.generateAuthToken();
      res.status(200).send({ name: user.name, token: authToken });
    } else res.status(400).send("Incorrect Password");
  } else res.status(400).send("User not found");
});

router.post("/google", async (req, res) => {
  const { googleId, profilePicture, email, name } = req.body;
  let user = await User.findOne({ googleId });
  if (!user) {
    user = await User.findOne({ email });
    if (!user) {
      user = new User({
        googleId,
        name,
        email,
        profilePicture
      });
    } else {
      user.set({
        googleId,
        profilePicture
      });
    }
    try {
      user = await user.save();
    } catch (err) {
      console.log(err);
    }
  }
  return res.status(200).send({
    name: user.name,
    token: user.generateAuthToken()
  });
});

module.exports = router;
