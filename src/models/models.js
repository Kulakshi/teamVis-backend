const mongoose = require('mongoose');

const csvFile = new mongoose.Schema({
    userId: String,
    fileName: String,
    fileId: String
});

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
});

const User = mongoose.model('User', userSchema);
const csvFileModel = mongoose.model('csvFile', csvFile);

module.exports = {
    csvFileModel,
    User,
};
