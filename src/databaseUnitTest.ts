// Dependecies
import mongoose from "mongoose";
import {MongoMemoryServer} from 'mongodb-memory-server';

// Mongo Connection to unit testing
let mongod : MongoMemoryServer | null = null;

const startConnection = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  console.log(`This is the URI: ${uri}`);
  mongoose.connect(uri);
};

const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod?.stop();
  console.log('Database connection was closed');
};

const clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection : mongoose.AnyObject = collections[key];
    await collection.deleteMany();
  }
};

// Check if the connection was succeeded
mongoose.connection.once('open', async () => {
  console.log('Mongodb connection stablished');
});

// Check if the connection was failed
mongoose.connection.on('error', err => {
  console.log(err);
  process.exit(0);
});

export default {
  startConnection,
  closeDatabase,
  clearDatabase,
};
