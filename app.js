const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const config = require("config");
const cors = require("cors");

const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const examRoute = require("./routes/examRoute");
const courseRoute = require("./routes/courseRoute");
const collegeRoute = require("./routes/collegeRoute");

const app = express();
app.set("trust proxy", true);

const PORT = process.env.PORT || 5000;

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL! JWT Private Key not provided");
  process.exit(1);
}

const dbConnectionString =
  process.env.NODE_ENV === "production"
    ? `mongodb+srv://${config.get("dbUsername")}:${config.get(
        "dbPassword"
      )}@ravikcluster-aiykj.mongodb.net/test?retryWrites=true&w=majority`
    : "mongodb://localhost/examkhojo_db";

mongoose
  .connect(dbConnectionString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("Error while connecting to MongoDB"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "examkhojo.netlify.com"
        : "http://localhost:3000"
  })
);

app.listen(PORT, (req, res) => console.log(`Server started on PORT ${PORT}`));

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/exams", examRoute);
app.use("/api/courses", courseRoute);
app.use("/api/colleges", collegeRoute);
