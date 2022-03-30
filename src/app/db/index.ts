// Dependecies
import {connect} from "mongoose";
import db from './type';

const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB
} = process.env;

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

const options = {
  useNewUrlParser: true,
  connectTimeoutMS: 10000,
};

const run = async (): Promise<void> => {
  try {
    await connect(url, options);
    console.log('Database is Connected');
  } catch(err) {
    console.log(err);
  }
};

const connection :db = {run};

export default connection;
