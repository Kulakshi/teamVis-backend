const express = require('express');
const router = express.Router();
const UserModel = require('../models/User');

// Endpoint to seed dummy data
router.post('/seed', async (req, res) => {
  try {
    const dummyUsers = [
      { userId: 'user1', name: 'John Doe' },
      { userId: 'user2', name: 'Jane Doe' },
      // Add more dummy data as needed
    ];

    await UserModel.insertMany(dummyUsers);
    res.status(200).json({ message: 'Dummy data seeded successfully.' });
  } catch (error) {
    console.error('Error seeding dummy data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
