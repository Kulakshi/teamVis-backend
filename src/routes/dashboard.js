const express = require('express');
const router = express.Router();
const {getProjectsByUserId, getCsvFile, createNewProject,
    uploadCSV, createChart, getCharts, addUser} = require('../services/dashboard');
const {ProjectModel} = require("../models/models");

router.post('/new_project', uploadCSV.single('csvFile'), async (req, res) => {
  // Access userId, name, and the uploaded CSV file in req.body and req.file
  const { userId, name } = req.body;
    try {
        const result = await createNewProject(userId, name, req.file);
        res.status(200).json({result});
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'});
    }
});

router.get('/get_files/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const projects = await getProjectsByUserId(userId);
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'});
    }
});


router.get('/get_file', async (req, res) => {
    const {userId, fileId, isOwner} = req.query;
    try {
        const csvFiles = await getCsvFile(userId, fileId, isOwner);
        res.status(200).json({csvFiles});
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'});
    }
});


router.post('/save_chart', async (req, res) => {
  const {userId, projectId, x, y, title, chartType, isLocked, isOwner } = req.body;
    try {
        const chart = await createChart(userId, projectId, title, x, y, chartType, isLocked, isOwner);
        res.status(200).json({chart});
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'});
    }
});


router.get('/get_charts', async (req, res) => {
    const {userId, projectId, isOwner} = req.query;

    try {
        const charts = await getCharts(userId, projectId, isOwner);
        res.status(200).json({charts});
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'});
    }
});

router.post('/add_user', async (req, res) => {
    const {ownerId, projectId, userId} = req.body;

    try {
        const project = await addUser(ownerId, projectId, userId);
        res.status(200).json({project});
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'});
    }
});


module.exports = router;