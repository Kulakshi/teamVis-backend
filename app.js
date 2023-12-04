// app.js
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./src/routes');
const { Todo } = require('./src/models/models');
const {addDummyData} = require("./src/services/dummyDataService");

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());

// Use the todoRoutes for all routes related to todos
app.use('/api', routes);
addDummyData();



// Other routes or middleware can be added here

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});




