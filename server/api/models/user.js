'use strict';

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const keysConfig = require('../config/keys');

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    default: false,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  images: [],
  hash: {
    type: String,
    default: "test"
  },
  salt: {
    type: String,
    default: "test"
  }
});

userSchema.methods.setPassword = (user, password) => {
  user.salt = crypto.randomBytes(256).toString('hex');
  user.hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = (user, password) => {
  let hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');
  return user.hash === hash;
};

userSchema.methods.generateJwt = (user) => {
  let expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);
  return jwt.sign({
    _id: user._id,
    email: user.email,
    name: user.name,
    exp: parseInt(expiry.getTime() / 1000, 10),
  }, keysConfig.jwtToken);
  // TODO: Change this over to a properties file
};

const User = mongoose.model('User', userSchema);

module.exports = {
  User: User
};
