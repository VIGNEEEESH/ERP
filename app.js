const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");

const path = require("path");
app.use(bodyParser.json());
app.use(cors());
app.use("/uploads/images", express.static(path.join("uploads", "images")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET",
    "POST",
    "PATCH",
    "DELETE",
    "OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method == "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rw3waqy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(app.listen(4444))
  .catch((err) => {
    console.log(err);
  });
