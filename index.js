const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 8000;
const path = require("path");

const urlencodedParser = bodyParser.urlencoded({ extended: false });

const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const mongoose = require("mongoose");

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(port))
  .catch((err) => console.log("err"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "static/public")));

app.get("/", (req, res) => {
  res.render("pages/home");
});

app.get("/vraag1", (req, res) => {
  // console.log(req.query);
  res.render("pages/vraag1", { qs: req.query });
});

app.post("/vraag1", urlencodedParser, (req, res) => {
  console.log(req.body);
  res.render("pages/matchresultaten", { data: req.body });
});

app.get("/matchresulaten:name", (req, res) => {
  res.render("pages/matchresultaten");
});

app.get("/Overons", (req, res) => {
  res.send("Over FoundationMatch");
});

app.get("/login", (req, res) => {
  res.send("login bij FoundationMatch");
});

app.get("/favorieten/:name", (req, res) => {
  res.render("favorieten", { persoon: req.params.name });
});

app.use("*", (req, res) => {
  res.status(404).send("Page Not Found");
});

app.listen(port, () => console.log(`listening on port ${port}`));
