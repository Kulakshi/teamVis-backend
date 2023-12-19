const {ProjectModel, chartModel, User} = require('../models/models');
const fs = require("fs");
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');
const csv = require('csv-parser');

// Set up Multer for handling file uploads
const storageCSV = multer.diskStorage({
    destination: (req, file, cb) => {
        const userId = req.body.userId;
        const userFolder = path.join(__dirname, 'uploads', userId);

        // Create user folder if not exists
        if (!fs.existsSync(userFolder)) {
            fs.mkdirSync(userFolder);
        }

        cb(null, userFolder);
    },
    filename: async (req, file, cb) => {
        const {userId, name} = req.body;
        const fileName = userId + '_' + name + '_' + file.originalname;
        cb(null, fileName);
    },
});

const uploadCSV = multer({storage: storageCSV});

const createNewProject = async (userId, projectName, file) => {
    try {
        const fileName = userId + '_' + projectName + '_' + file.originalname;
        const newProject = new ProjectModel({
            ownerId: userId,
            fileName: fileName,
            projectName: projectName,
        });
        const output = await newProject.save();
        return output
    } catch (error) {
        console.error('Error fetching CSV files:', error);
        throw error;
    }
};

const addUser = async (ownerId, projectId, userId) => {
    try {
        const projectObjectId = new mongoose.Types.ObjectId(projectId)
        const existingProject = await ProjectModel.findOne({ownerId, _id: projectObjectId});

        if (existingProject) {
            const updatedProject = await ProjectModel.findOneAndUpdate(
                {ownerId, _id: projectObjectId},
                {$addToSet: {users: userId}},
                {new: true}
            );
            return updatedProject
        } else {
            throw new Error('Project not found for the provided userId.');
        }

    } catch (error) {
        console.error('Error fetching CSV files:', error);
        throw error;
    }
};

const getProjectsByUserId = async (ownerId) => {
    try {
        let myProjects = [];
        myProjects = await ProjectModel.find({ownerId});

        const user = await User.findOne({username: ownerId});
        let sharedProjects;
        if (user) {
            const userId = user._id
            sharedProjects = await ProjectModel.find({users: userId.toString()});
        }
        const projects = myProjects.concat(sharedProjects)
        return projects;
    } catch (error) {
        console.error('Error fetching CSV files:', error);
        throw error;
    }
};

const readCsvContent = (userId, fileName) => {
    try {
        const filePath = path.join(__dirname, 'uploads', userId, fileName);
        return new Promise((resolve, reject) => {
            const results = [];
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => resolve(results))
                .on('error', (error) => reject(error));
        });
    } catch (error) {
        console.error('Error reading CSV content:', error);
        throw error;
    }
};

const getCsvFile = async (userId, projectId, isOwner = false) => {
    try {
        const projectObjectId = new mongoose.Types.ObjectId(projectId)
        const project = await ProjectModel.findOne({_id: projectObjectId});

        if (!project) {
            throw new Error('Project not found for the provided Id.');
        }

        let ownerId = await getProjectOwner(userId, projectId, isOwner)
        const csvContent = await readCsvContent(ownerId, project.fileName);
        return {
            projectId,
            fileName: project.fileName,
            csvContent,
        };
    } catch (error) {
        console.error('Error fetching CSV file:', error);
        throw error;
    }
};


const createChart = async (userId, projectId, title, x, y, chartType = "Line", isLocked = false, isOwner = false) => {
    try {
        const projectObjectId = new mongoose.Types.ObjectId(projectId)
        const project = await ProjectModel.findOne({_id: projectObjectId});

        if (project) {
            let ownerId = await getProjectOwner(userId, projectId, isOwner)
            const csvData = await readCsvContent(ownerId, project.fileName);
            if (csvData && csvData.length > 0 && Object.keys(csvData[0]).includes(x) && Object.keys(csvData[0]).includes(y)) {

                const existingChart = await chartModel.findOne({projectId, title, ownerId});

                if (existingChart) {
                    const updatedChart = await chartModel.findOneAndUpdate(
                        {projectId, title, ownerId},
                        {
                            $set: {
                                chartType: chartType,
                                x: x,
                                y: y,
                                isLocked: isLocked
                            }
                        },
                        {new: true}
                    );

                    return updatedChart;
                } else {
                    const newChartEntry = new chartModel({
                        projectId: projectId,
                        ownerId,
                        title: title || "untitled",
                        chartType: chartType,
                        x: x,
                        y: y,
                        isLocked: isLocked,
                        updatedBy: userId,
                        updatedAt: Date.now()
                    });
                    const output = await newChartEntry.save();
                    return output;
                }

            }
        } else {
            return "invalid data";

        }
    } catch (error) {
        console.error('Error fetching CSV file:', error);
        throw error;
    }
}

const getProjectOwner = async (userId, projectId, isOwner) => {
    console.log(userId, projectId, isOwner, isOwner === "false")
    if (isOwner === "false") {
        const project = await getProjectWhenNotOwner(userId, projectId)
        if (!project) {
            throw new Error('Project not found for the provided userId.');
        }
        const ownerId = project.ownerId
        return ownerId
    } else {
        return userId
    }
}

const getProjectWhenNotOwner = async (userId, projectId) => {
    let project;
    const user = await User.findOne({username: userId});
    if (user) {
        const userId = user._id
        const projectObjectId = new mongoose.Types.ObjectId(projectId)
        project = await ProjectModel.findOne({_id: projectObjectId, users: userId.toString()});
    }
    return project
}
const getCharts = async (userId, projectId, isOwner = false) => {
    try {
        let ownerId = await getProjectOwner(userId, projectId, isOwner)
        const projObjectId = new mongoose.Types.ObjectId(projectId)
        const project = await ProjectModel.findOne({_id: projObjectId, ownerId});
        if (!project) {
            throw new Error('Project not found for the provided userId.');
        }
        const charts = await chartModel.find({ownerId, projectId});
        return charts;
    } catch (error) {
        console.error('Error fetching Charts:', error);
        throw error;
    }
};


module.exports = {
    createNewProject,
    addUser,
    uploadCSV,
    getProjectsByUserId,
    getCsvFile,
    createChart,
    getCharts
};
