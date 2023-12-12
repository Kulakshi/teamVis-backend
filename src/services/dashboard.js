const {csvFileModel} = require('../models/models');
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
        const fileName = Date.now() + '_' + file.originalname;
        cb(null, fileName);

        // Save entry to MongoDB
        const userId = req.body.userId;
        const newCsvEntry = new csvFileModel({
            userId: userId,
            fileName: fileName,
        });

        const output = await newCsvEntry.save();
        console.log(output)
    },
});

const uploadCSV = multer({storage: storageCSV});

const getCsvFilesByUserId = async (userId) => {
    try {
        const files = await csvFileModel.find({userId: userId}, 'fileName');
        return files.map(file => file.fileName);
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
    console.log(fileId)
    try {
        const fileObjectId = new mongoose.Types.ObjectId(fileId)
        const file = await csvFileModel.findOne({_id: fileObjectId});

        if (!file) {
            throw new Error('CSV file not found for the provided userId and fileId.');
        }
        console.log(file)
        // Assuming you have a function to read the CSV content
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

module.exports = getCsvFilesByUserId;


module.exports = {
    uploadCSV,
    getCsvFilesByUserId,
    getCsvFile
};
