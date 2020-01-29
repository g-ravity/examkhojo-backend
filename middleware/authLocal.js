const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

const { User, validateUser } = require("../models/user");

const registerUser = async (req, res) => {
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
        res.status(200).send(authToken);
      } catch (err) {
        console.log("Error while registering user!");
      }
    } else res.status(400).send("User already exists");
  } else res.status(400).send(checkValid.error.details[0].context.label);
};

const loginUser = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (isValid) {
      const authToken = user.generateAuthToken();
      res.status(200).send(authToken);
    } else res.status(400).send("Incorrect Password");
  } else res.status(400).send("User not found");
};

const verifyUser = async (req, res, next) => {
  if (req.headers.authorization) {
    try {
      const id = jwt.verify(
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

module.exports = {
  registerUser,
  loginUser,
  verifyUser
};
