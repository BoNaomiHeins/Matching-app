// Met deze pagina heb ik verschillende foundations in de database gezet
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// De database in een Constante
const dbName = 'testDatabase';
async function run() {
  try {
    await client.connect();
    console.log('Connected correctly to server');
    const db = client.db(dbName);
    // collection "foundation"
    const col = db.collection('foundation');
    // document opmaken
    const foundationsDocument = {
      name: 'Airbrush flawless foundation',
      brand: 'Charlotte Tilbury',
      price: 40.0,
      productDetails: [
        'FLAWLESS',
        'PORELESS-looking',
        'stay all day',
        'weightless',
        'full coverage',
        'matte finish',
      ],
    };

    // Insert a single document, wait for promise so we can read it back
    const p = await col.insertOne(foundationsDocument);
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
