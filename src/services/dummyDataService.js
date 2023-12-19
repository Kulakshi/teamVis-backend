const mongoose = require('mongoose');
const { User} = require('../models/models');

const clearAllData = async () => {
  try {
    const modelNames = mongoose.modelNames();

    for (const modelName of modelNames) {
      const Model = mongoose.model(modelName);
      const result = await Model.deleteMany({});
      console.log(`Cleared ${result.deletedCount} documents from the ${modelName} collection.`);
    }

    console.log('Cleared all data in the database.');
  } catch (error) {
    console.error('Error clearing data:', error);
  } finally {
    // Close the MongoDB connection if needed (optional)
    // mongoose.connection.close();
  }
};
const addDummyData = async () => {
  try {
    const dummyUsers = [
      { username: 'Bob', email: 'user1@gamil.com' },
      { username: 'Ann', email: 'user2@gmail.com' },
      { username: 'Mangfei', email: 'user3@gmail.com' },
      { username: 'Mike', email: 'user4@gmail.com' },
      { username: 'Tailuo', email: 'user5@gmail.com' },
    ];

    const insertedUsers = await User.insertMany(dummyUsers);

    return { message: 'Dummy data added successfully', users: insertedUsers };
  } catch (error) {
    console.log(error)
    throw new Error('Error adding dummy data');
  }
};

module.exports = {
  clearAllData,
  addDummyData,
};
