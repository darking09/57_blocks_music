// Dependecies
import express from 'express';
import db from './app/db';

db.run();

const app = express();
const PORT = 8080;
app.get('/', (req, res) => {
  res.send('Hello World! 2');
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
