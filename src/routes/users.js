// routes/users.js
const express = require('express');
const router = express.Router();
const {User} = require('./../models/models');
const {login} = require("../services/user");

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


module.exports = router;
