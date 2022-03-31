// Dependecies
import mongoose from "mongoose";
import {MongoMemoryServer} from 'mongodb-memory-server';

// Mongo Connection to unit testing
let mongod : MongoMemoryServer | null = null;

const startConnection = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  mongoose.connect(uri);
};

const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod?.stop();
};

const clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection : mongoose.AnyObject = collections[key];
    await collection.deleteMany();
  }
};

// Check if the connection was failed
mongoose.connection.on('error', (err:any) => {
  console.log(err);
  process.exit(0);
});

export default {
  startConnection,
  closeDatabase,
  clearDatabase,
};
