const express = require('express');
const mongoose = require('mongoose');
// const yjs = require('yjs');
// const { WebsocketProvider } = require('y-websocket');
const dashboard = require('./src/routes/dashboard');
const users = require('./src/routes/users');
const {clearAllData, addDummyData} = require("./src/services/dummyDataService");
const cors = require('cors');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/mydatabase', {
// mongoose.connect('mongodb+srv://kulakshif:jV4BcFwFGL9hx3Hy@cluster0.ybbdiaj.mongodb.net/?retryWrites=true&w=majority/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());

app.use('/api/dashboard/', dashboard);
app.use('/api/users/', users);

// clearAllData()
// addDummyData()


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});




