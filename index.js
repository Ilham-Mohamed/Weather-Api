require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const routes = require('./routes');

const connectionString = process.env.DATABASE_URL;
const app = express();

app.use(express.json());
app.use('/api', routes);

const PORT = 3000;

mongoose.connect(connectionString);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
