const express = require('express');
const {User} = require('../models/models');



const login = async (username) => {
  try {
   return await User.findOne({username})
  } catch (error) {
    console.error(error);
    return false
  }
}



const getAllUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};
const search = async (searchValue) => {
  try {
    const regex = new RegExp(searchValue, 'i');
    const users = await User.find({ username: regex });
    return users;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

module.exports = {
    login,
    search,
  getAllUsers
};
