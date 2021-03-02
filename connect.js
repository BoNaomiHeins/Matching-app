const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  if (err) {
    throw err;
  }
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  console.log("test");

  client.close();
});
