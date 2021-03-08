require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 8000;
const path = require("path");

const urlencodedParser = bodyParser.urlencoded({ extended: false });

const { MongoClient } = require("mongodb");
const { Router } = require("express");

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const ObjectId = require("mongodb").ObjectID;
const { get } = require("http");

const dbName = "testDatabase";

async function run() {
  try {
    await client.connect();
    console.log("Connected correctly to server");
    const db = client.db(dbName);
  } catch (err) {
    console.error(err.stack);
  }
  return client;
}
run().catch(console.dir);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "static/public")));

app.get("/", (req, res) => {
  res.render("pages/home");
});

app.get("/vraag1", (req, res) => {
  console.log(req.query);
  res.render("pages/vraag1", { qs: req.query });
});

app.post("/vraag1", urlencodedParser, (req, res) => {
  const antwoorden = {
    userID: ObjectId().toString(),
    name: req.body.name,
    maxPrijs: req.body.maxPrijs,
  };
  console.log(antwoorden);
  const db = client.db(dbName);
  db.collection("people").insertOne(antwoorden, () => {
    console.log(antwoorden.name, "Heeft succesvol form ingezonden");
  });
  res.render(
    "pages/matchresultaten",
    { antwoorden },
    console.log("formulier invullen gelukt")
  );
});

app.post("/update", urlencodedParser, async (req, res) => {
  const { id } = req.params;
  const db = client.db(dbName);
  const antwoorden = {
    userID: req.body.userID,
    name: req.body.name,
    maxPrijs: req.body.maxPrijs,
  };

  console.log(antwoorden);

  await db
    .collection("people")
    .findOneAndUpdate(
      { userID: req.body.userID },
      { $set: antwoorden },
      (id) => {
        console.log(`${antwoorden.name} geupdate antwoorden`);
      }
    );
  res.render(
    "pages/matchresultaten",
    { antwoorden },
    console.log("formulier updaten gelukt")
  );
});

app.get('/matchresulaten:name', (req, res) => {
  res.render('pages/matchresultaten');
});

// app.get("/matchresulaten", (req, res) => {
//   const db = client.db(dbName);
//   db.collection("foundation")
//     .find({ price: 40 })
//     .toArray((err, foundationsDocument) => {
//       res.render("pages/matchresulaten", {
//         foundationsDocument: foundationsDocument,
//       });
//     });
// });

app.use("*", (req, res) => {
  res.status(404).send("Page Not Found");
});

app.listen(port, () => console.log(`listening on port ${port}`));
