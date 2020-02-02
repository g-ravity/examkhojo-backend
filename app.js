const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const config = require("config");
const passport = require("passport");

const authRoute = require("./routes/authRoute");
const adminRoute = require("./routes/adminRoute");

const app = express();
const PORT = 5000;

if (
  !config.get("jwtPrivateKey") ||
  !config.get("googleSecret") ||
  !config.get("facebookSecret")
) {
  console.error("FATAL! Auth Credentials not provided properly");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost/examkhojo_db", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("Error while connecting to MongoDB"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

app.listen(PORT, (req, res) => console.log(`Server started on PORT ${PORT}`));

app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
