const {ProjectModel, chartModel} = require('../models/models');
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
            userId: userId,
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

const getProjectsByUserId = async (userId) => {
    try {
        const projects = await ProjectModel.find({userId: userId});
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

const getCsvFile = async (userId, fileId) => {
    try {
        const fileObjectId = new mongoose.Types.ObjectId(fileId)
        const file = await ProjectModel.findOne({_id: fileObjectId});

        if (!file) {
            throw new Error('CSV file not found for the provided userId and fileId.');
        }

        const csvContent = await readCsvContent(userId, file.fileName);
        return {
            fileId,
            fileName: file.fileName,
            csvContent,
        };
    } catch (error) {
        console.error('Error fetching CSV file:', error);
        throw error;
    }
};
const createChart = async (userId, projectId, title, x, y, chartType = "Line", isLocked = false) => {
    try {
        const projectObjectId = new mongoose.Types.ObjectId(projectId)
        const project = await ProjectModel.findOne({_id: projectObjectId});

        if (project) {
            const csvData = await readCsvContent(userId, project.fileName);
            if (csvData && csvData.length > 0 && Object.keys(csvData[0]).includes(x) && Object.keys(csvData[0]).includes(y)) {

                const existingChart = await chartModel.findOne({projectId, title, ownerId: userId});

                if (existingChart) {
                    const updatedChart = await chartModel.findOneAndUpdate(
                        {projectId, title, ownerId: userId},
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
                        ownerId: userId,
                        title: title || "untitled",
                        chartType: chartType,
                        x: x,
                        y: y,
                        isLocked: isLocked
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

const getCharts = async (userId, projectId) => {
    try {
        console.log(userId, projectId)
        const projObjectId = new mongoose.Types.ObjectId(projectId)
        const project = await ProjectModel.findOne({_id: projObjectId, userId});

        if (!project) {
            throw new Error('Project not found for the provided userId.');
        }else{
            const charts = await chartModel.find({ownerId:userId, projectId});
            console.log(charts)
            return charts;
        }
    } catch (error) {
        console.error('Error fetching CSV file:', error);
        throw error;
    }
};


module.exports = {
    createNewProject,
    uploadCSV,
    getProjectsByUserId,
    getCsvFile,
    createChart,
    getCharts
};
