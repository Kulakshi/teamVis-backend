const express = require('express');
const mongoose = require('mongoose');
const dashboard = require('./src/routes/dashboard');
const users = require('./src/routes/users');
const {addDummyData} = require("./src/services/dummyDataService");
const cors = require('cors');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());

app.use('/api/dashboard/', dashboard);
app.use('/api/users/', users);

// addDummyData()


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});




