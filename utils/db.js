const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

let db;

async function connectToDB() {
  if (db) return db;
  try {
    await client.connect();
    db = client.db('pizza-y-punto');
    console.log("Conectado a MongoDB.");
    return db;
  } catch (err) {
    console.error("Error al conectar a MongoDB:", err);
    process.exit(1);
  }
}

async function closeDB() {
  await client.close();
  console.log("Conexión a MongoDB cerrada.");
}

module.exports = { connectToDB, closeDB, client };