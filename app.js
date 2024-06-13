"use strict";
const port = process.env.PORT || 3000;
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./utils/database");
var hpp = require("hpp");
const fs = require("fs");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const routes = require("./routes/index");
let cors = require("cors");
app.use(cookieParser());
app.enable("trust proxy", 1);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(cors());

// app.use(blockAceesUrl);

// Sử dụng express.static cho tất cả các tài nguyên tĩnh
app.use(express.static("public"));
app.use("/dataImages", express.static("dataImages"));

app.use(hpp());

app.use(
  session({
    secret: "the-super-strong-secrect",
    saveUninitialized: true,
    cookie: { maxAge: 31536000 },
    resave: false,
  })
);
routes(app);

app.get("*", function (req, res) {
  res.json({ status: 404, contact: "https://t.me/NodejsdevBE" });
});
app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
