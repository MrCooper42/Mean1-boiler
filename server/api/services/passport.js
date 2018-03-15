'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  () => {
    User.findOne({
      email: username
    }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user || !user.validPassword(password)) {
        return done(null, false, {
          message: 'Username or password incorrect please try again.'
        });
      }
      return done(null, user);
    });
  }
));
