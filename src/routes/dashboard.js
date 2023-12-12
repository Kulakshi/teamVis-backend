// routes/todoRoutes.js
const express = require('express');
const router = express.Router();
const {Todo} = require('../models/models');
const {getCsvFilesByUserId, getCsvFile, uploadCSV} = require('../services/dashboard');


router.post('/upload_csv', uploadCSV.single('csvFile'), (req, res) => {
    res.send('File uploaded successfully!');
});

router.get('/get_files/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const csvFiles = await getCsvFilesByUserId(userId);
        res.status(200).json({csvFiles});
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'});
    }
});


router.get('/get_file', async (req, res) => {
    const {userId, fileId} = req.query;
    console.log(req.query)
    try {
        const csvFiles = await getCsvFile(userId, fileId);
        res.status(200).json({csvFiles});
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'});
    }
});


// Add
module.exports = router;