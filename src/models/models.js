const mongoose = require('mongoose');

const Project = new mongoose.Schema({
    userId: String,
    projectName: String,
    fileName: String,
    fileId: String,
});

const chart = new mongoose.Schema({
    projectId: String,
    ownerId: String,
    title: String,
    chartType: String,
    x: String,
    y: String,
    isLocked: Boolean
});

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
});

const User = mongoose.model('User', userSchema);
const ProjectModel = mongoose.model('Project', Project);
const chartModel = mongoose.model('chart', chart);

module.exports = {
    ProjectModel,
    User,
    chartModel,
};
