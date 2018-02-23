'use strict';
// Strengthen this area.
// const mongoose = require('mongoose');
const User = require('./user.js').User;

console.log('we are connected in db.js WOO!');

module.exports = {
  User: User
};
