import { Router } from 'express';
import { User } from '../models/user';
import * as passport from 'passport';
import * as jwt from 'express-jwt';

const authRoutes = Router();
const keyConfig = require('../config/keys');

const ctrlProfile = require('../controllers/profileController');
const auth = jwt({
  secret: `${keyConfig.jwtToken}`, // TODO: Fix this to use specific key
  userProperty: 'payload'
});
//
// authRoutes.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// authRoutes.get('/google/callback', passport.authenticate('google'), (req, res) => res.redirect('/'));
// authRoutes.get('/google/logout', (req, res) => {
//   req.logout();
//   res.redirect('/');
// });
// authRoutes.get('/current_user', (req, res) =>
//   req.user ? res.send(req.user) : res.send({})
// );

authRoutes.post('/register', (req, res) => {
  User.findOne({ 'email': req.body.email }, (error, foundUser) => {

    if (error) {
      console.log(error, 'error');
      throw new Error(error);
      // TODO: Handle email error
    }
    if (foundUser) {
      console.log('this user exists HANDLE THIS ' + foundUser);
      throw new Error('User Exists Already');
      // TODO: Handle email already exists
    } else {
      let newUser;

      newUser = new User({
        email: req.body.email,
        name: req.body.name
      });
      newUser.setPassword(newUser, req.body.password);
      newUser.save((error, result) => {
        if (error) {
          console.log('did something happen????????');
          return res.status(500).json({
            title: 'Bad things happened: ',
            error: error
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
    console.log(foundUser, 'found user in then');
  }).catch((error) => {
    console.log(error);
    throw new Error(error);
    //  TODO: Handle errors
  });
});

authRoutes.post('/login', (req, res) => {
  User.findOne({
    email: req.body.email
  }, (error, user) => {
    if (error) {
      return res.status(500).json({
        title: 'Error in Login',
        error: error
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
    const token = user.generateJwt(user);
    console.log(user.token, 'user signed in');
    // TODO: take this console log out
    res.status(200).cookie('token', token).json({
      message: 'Successfully logged in',
      token: token,
      userId: user._id
    });
  });
});

authRoutes.get('/profile', auth, ctrlProfile.profileRead);

export { authRoutes };
