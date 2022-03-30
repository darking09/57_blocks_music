// Enviroment Constants
const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB,
  JWT_SECRET
} = process.env;

export default {
  jwtSecret: JWT_SECRET || 'somesecret',
  DB: {
    URL: `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`
  }
};
