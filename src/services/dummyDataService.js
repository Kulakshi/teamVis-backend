// services/todoService.js
const { Todo } = require('../models/models');

const addDummyData = async () => {
  try {
    // Dummy data to be inserted
    const dummyTodos = [
      { task: 'Task 1', completed: false },
      { task: 'Task 2', completed: true },
      { task: 'Task 3', completed: false },
    ];

    // Insert dummy data into the todos collection
    const insertedTodos = await Todo.insertMany(dummyTodos);

    return { message: 'Dummy data added successfully', todos: insertedTodos };
  } catch (error) {
    throw new Error('Error adding dummy data');
  }
};

module.exports = {
  addDummyData,
};
