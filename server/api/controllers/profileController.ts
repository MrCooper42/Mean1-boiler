'use strict';

const ProfileUser = require('../models/user.js').ProfileUser;

const register = (req, res) => {
  console.log('Registering user: ' + req.body.email);
  res.status(200);
  res.json({
    'message': 'ProfileUser registered: ' + req.body.email
  });
};

const profileRead = (req, res) => {
  console.log(req.payload, ' REQ in profile READ');
  if (!req.payload._id) {
    res.status(401).json({
      'message': 'UnauthorizedError: private profile'
    });
  } else {
    ProfileUser
      .findById(req.payload._id)
      // TODO: remove exec and add error handling for user not found etc
      .exec((err, user) => {
        // TODO: use promise here
        res.status(200).json(user);
      });
  }
};

module.exports = {
  register: register,
  profileRead: profileRead
};