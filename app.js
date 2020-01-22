const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

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

app.listen(PORT, (req, res) => console.log(`Server started on PORT ${PORT}`));

app.get("/", (req, res) => res.send("Welcome"));
