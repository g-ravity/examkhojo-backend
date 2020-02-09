const config = require("config");
const jwt = require("jsonwebtoken");

const { User } = require("../models/user");

const verifyUser = async (req, res, next) => {
  if (req.headers.authorization) {
    try {
      const { id } = jwt.verify(
        req.headers.authorization,
        config.get("jwtPrivateKey")
      );
      const user = await User.findById(id);
      req.user = user;
    } catch (err) {
      return res.status(400).send("Invalid Token");
    }
  }
  next();
};

module.exports = verifyUser;
