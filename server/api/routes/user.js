'use strict';

const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const User = require('../models/user.js').User;

const ctrlProfile = require('../controllers/profile.js');
const auth = jwt({
  secret: `${process.env.JWT_SECRET}`,
  userProperty: 'payload'
});

// TODO: Beef this up IF NOT ALLOWED REDIRECT!!! THIS SHOULD ALSO BE
// TODO: HANDLED THROUGH SERVER AND ANGULAR

router.post('/register', (req, res) => {
  User.findOne({ 'email': req.body.email }, (err, foundUser) => {

    if (err) {
      console.log(err, "err");
      throw new Error(err);
      // TODO: Handle email error
    }
    if (foundUser) {
      console.log("this user exists HANDLE THIS " + foundUser);
      throw new Error("User Exists Already");
      // TODO: Handle email already exists
    } else {
      let newUser;

      newUser = new User({
        email: req.body.email,
        name: req.body.name
      });
      newUser.setPassword(newUser, req.body.password);
      newUser.save((err, result) => {
        if (err) {
          console.log("did something happen????????");
          return res.status(500).json({
            title: 'Bad things happened: ',
            error: err
          });
        }
        console.log(`Result of user created: ${result}`);
        res.status(201).json({
          message: 'User created',
          obj: result
        });
      });
    }
  }).then(foundUser => {
    console.log(foundUser, "found user in then");
  }).catch((err) => {
    console.log(err);
    throw new Error(err);
    //  TODO: Handle errors
  });
});

router.post('/login', (req, res) => {
  User.findOne({
    email: req.body.email
  }, (err, user) => {
    if (err) {
      return res.status(500).json({
        title: 'Error in Login',
        error: err
      });
    }
    if (!user || !user.validPassword(user, req.body.password)) {
      console.log(user.validPassword(user, req.body.password));
      return res.status(500).json({
        title: 'Login failed',
        error: {
          message: 'Invalid login credentials'
        }
      });
    }
    let token = user.generateJwt(user);
    console.log(user.token, "user signed in");
    // TODO: take this console log out
    res.status(200).cookie('token', token).json({
      message: 'Successfully logged in',
      token: token,
      userId: user._id
    });
  });
});

router.get('/profile', auth, ctrlProfile.profileRead);

module.exports = router;
