const express = require("express");

const { verifyUser } = require("../middleware/authLocal");

const router = express.Router();

router.get("/", verifyUser, (req, res) => {
  return res.status(200).send(req.user.name);
});

module.exports = router;
