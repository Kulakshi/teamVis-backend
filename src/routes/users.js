// routes/users.js
const express = require('express');
const router = express.Router();
const {User} = require('./../models/models');
const {login, search, getAllUsers} = require("../services/user");

router.post('/login', async (req, res) => {
    const {userId} = req.body;
    try {
        const existingUser = await login(userId);
        console.log(existingUser)
        if (existingUser) {
            res.status(200).json({message: 'Username found. Login successful.'});
        } else {
            res.status(404).json({message: 'Username not found. Login failed.'});
        }
    } catch (error) {
        res.status(500).json({message: 'Internal Server Error'});
    }
});

router.get('/all', async (req, res) => {
  // Get the 'search' query parameter from the request
  const searchValue = req.query.search;

    try {
        const users = await getAllUsers();
        res.status(200).json({users});
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'});
    }
});

router.get('/', async (req, res) => {
  // Get the 'search' query parameter from the request
  const searchValue = req.query.search;

    try {
        const users = await search(searchValue);
        res.status(200).json({users});
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'});
    }
});


module.exports = router;
