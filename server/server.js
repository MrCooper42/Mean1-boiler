'use strict';

if (process.env.NODE_ENV !== `production`) {
  require(`dotenv`).config();
}

const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const expressSanitizer = require('express-sanitizer');
const hbs = require('hbs');
const passport = require('passport');
const jwt = require('express-jwt');
const mongoose = require('mongoose');

mongoose.connect(`${process.env.MONGO_URI}`)
  .then(() => console.log(`App connected to MongoDB`))
  .catch((err) => {
    console.error(`App starting error: ${err.stack}`);
    process.exit(1);
  });

const app = express();

const apiRoutes = require('./api/routes/app');
const db = require('./api/models/db');
const config = require('./api/config/passport');
const auth = jwt({
  secret: `${process.env.JWT_SECRET}`,
  userProperty: 'payload'
});

// view engine setup
app.set('view', path.join(__dirname, '../client/views'));
app.set('view engine', 'hbs');

// uncomment after placing your favorite favicon in client
// app.use(favicon(path.join(__dirname, '../client/src', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../dist')));

// sanitizer
app.use(expressSanitizer());
app.use(passport.initialize());
app.use('/api', apiRoutes);

app.use('*', (req, res) => res.sendFile(path.join(__dirname, '../dist/index.html')));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.local.error = req.app.get('env') === 'development' ? err : {};

  // TODO: render the error page
  res.status(err.status || 500);
  res.json({ 'message': `${err.name} : ${err.message}` });
});

module.exports = app;
