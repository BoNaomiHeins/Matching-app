const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// The database to use
const dbName = "test";

async function run() {
  try {
    await client.connect();
    console.log("Connected correctly to server");
    const db = client.db(dbName);
    // Use the collection "people"
    const col = db.collection("people");
    // Construct a document
    const personDocument = {
      name: { first: "Bo", last: "Heins" },
      birth: new Date(2002, 2, 6), // June 23, 1912
      death: new Date(1954, 5, 7), // June 7, 1954
      contribs: ["Turing machine", "Turing test", "Turingery"],
      views: 1260000,
    };
    // Insert a single document, wait for promise so we can read it back
    const p = await col.insertOne(personDocument);
    // Find one document
    const myDoc = await col.findOne();
    // Print to the console
    console.log(myDoc);
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
