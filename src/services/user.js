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

module.exports = {
    login
};
