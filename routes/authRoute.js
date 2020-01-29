const express = require("express");
const passport = require("../middleware/passport.js");

const { registerUser, loginUser } = require("../middleware/authLocal");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"]
  })
);

router.get("/google/callback", passport.authenticate("google"), (req, res) => {
  if (req.user) res.status(200).send(req.user.generateAuthToken());
  else res.status(400).send("Something went wrong!");
});

router.get("/facebook", passport.authenticate("facebook"));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook"),
  (req, res) => {
    if (req.user) res.status(200).send(req.user.generateAuthToken());
    else res.status(400).send("Something went wrong!");
  }
);

module.exports = router;
