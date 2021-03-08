require("dotenv").config();
const express = require("express");
//om HTTP POST-gegevens te kunnen lezen, moeten we de "body-parser" node-module gebruiken. body-parser is een stuk express middleware dat de invoer van een formulier leest en het opslaat als een javascript-object dat toegankelijk is via req.body
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const app = express();
const port = process.env.PORT || 8000;
const path = require("path");

const { MongoClient } = require("mongodb");
const { Router } = require("express");

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const ObjectId = require("mongodb").ObjectID;
const { get } = require("http");
const { name } = require("ejs");

// Database connectie
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

// zet view engine naar ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Altijd het pad naar de public map volgen als een om statische documenten gaat
app.use(express.static(path.join(__dirname, "static/public")));

//home pagina
app.get("/", (req, res) => {
  res.render("pages/home");
});

//formulier pagina met de vragen
app.get("/vraag1", (req, res) => {
  console.log(req.query);
  res.render("pages/vraag1", { qs: req.query });
});

//Zet de antwoorden in een schema die naar de database verstuurd kan worden
app.post("/matchresultaten", urlencodedParser, (req, res) => {
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
  db.collection("foundation")
    .find()
    .toArray((err, foundation) => {
      res.render(
        "pages/matchresultaten",
        { antwoorden, foundation },
        console.log("formulier invullen gelukt")
      );
    });
});

// Om de antwoorden later nog te kunnen updaten moeten eerste de benodigede constanten geinitialisatieerd worden
app.post("/update", urlencodedParser, async (req, res) => {
  const { id } = req.params;
  const db = client.db(dbName);
  const antwoorden = {
    userID: req.body.userID,
    name: req.body.name,
    maxPrijs: req.body.maxPrijs,
  };

  console.log(antwoorden);

  // De  awaituitdrukking zorgt ervoor dat de uitvoering van de functie asyncpauzeert totdat a Promiseis afgehandeld
  // en dan pas kan de update door middel van het ophalen van de userID gedaan worden
  await db
    .collection("people")
    .updateOne({ userID: req.body.userID }, { $set: antwoorden }, (id) => {
      console.log(`${antwoorden.name} geupdate antwoorden`);
    });
  // tot slot wordt de resulaten pagina geladen met de nieuwe antwoorden.
  res.render(
    "pages/matchresultaten",
    { antwoorden },
    console.log("formulier updaten gelukt")
  );
});

//Voor alle pagina's die niet zijn gemaakt krijgt de bezoeker een 404 pagina te zien
app.use("*", (req, res) => {
  res.status(404).send("Page Not Found");
});

app.listen(port, () => console.log(`listening on port ${port}`));
