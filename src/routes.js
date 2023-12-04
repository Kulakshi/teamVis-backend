// routes/todoRoutes.js
const express = require('express');
const router = express.Router();
const { Todo } = require('./models/models');

// Route to get all todos
router.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Add
module.exports = router;