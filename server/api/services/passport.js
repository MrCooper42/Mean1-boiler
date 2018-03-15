'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

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

passport.use(
  new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true
  }, async (accessToken, refreshToken, profile, done) => {

    const existingUser = await User.findOne({
      googleId: profile.id
    });

    if (existingUser) {
      return done(null, existingUser);
    }

    const user = await new User({ googleId: profile.id }).save();
    done(null, user);

  })
);
