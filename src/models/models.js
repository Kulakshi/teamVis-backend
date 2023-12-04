// models.js
const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  task: String,
  completed: Boolean,
  ydoc: Object, // Add a field to store Yjs document
});

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  // other fields...
});

const Todo = mongoose.model('Todo', todoSchema);
const User = mongoose.model('User', userSchema);

module.exports = {
  Todo,
  User,
  // add more models as needed
};
