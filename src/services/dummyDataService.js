// services/todoService.js
const { Todo, User} = require('../models/models');

const addDummyData = async () => {
  try {
    const dummyUsers = [
      { username: 'user1', email: 'user1@gamil.com' },
      { username: 'user2', email: 'user2@gmail.com' },
    ];

    const insertedUsers = await User.insertMany(dummyUsers);

    return { message: 'Dummy data added successfully', users: insertedUsers };
  } catch (error) {
    throw new Error('Error adding dummy data');
  }
};

module.exports = {
  addDummyData,
};
