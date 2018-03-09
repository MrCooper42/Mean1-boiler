'use strict';




// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';

import * as express from 'express';
import { join } from 'path';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('../dist/server/main.bundle');

// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'client'));

// TODO: implement data requests securely
app.get('/api/*', (req, res) => {
  res.status(404).send('data requests are not supported');
});

// Server static files from /client
app.get('*.*', express.static(join(DIST_FOLDER, 'client')));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render(join(DIST_FOLDER, 'client', 'index.html'), { req });
});








require('zone.js/dist/zone-node');
require('reflect-metadata');
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

const apiRoutes = require('./api/routes/app');
const db = require('./api/models/db');
const config = require('./api/config/passport');
const auth = jwt({
  secret: `${process.env.JWT_SECRET}`,
  userProperty: 'payload'
});


if (process.env.NODE_ENV !== `production`) {
  require(`dotenv`).config();
}

mongoose.connect(`${process.env.MONGO_URI}`)
        .then(() => console.log(`App connected to MongoDB`))
        .catch((err) => {
          console.error(`App starting error: ${err.stack}`);
          process.exit(1);
        });
// Use for angular universal

const ngUniversal = require('@nguniversal/express-engine');
const { provideModuleMap } = require('@nguniversal/module-map-ngfactory-loader');
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('../dist-server/main.bundle');

const angularRouter = (req, res) => {
  res.render('index', { req, res });
};

const app = express();

app.engine('html', ngUniversal.ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));
app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, '../dist/client');

app.use('/api/*', apiRoutes);
app.get('/', angularRouter);

app.use(express.static(`${__dirname}/dist`));

app.get('*', angularRouter);
//
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//


// // uncomment after placing your favorite favicon in client
// app.use(favicon(path.join(__dirname, '../client/src', 'favicon.ico')));
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, '../dist')));
//
// // sanitizer
// app.use(expressSanitizer());
// app.use(passport.initialize());
// app.use('/api', apiRoutes);

// app.use('*', (req, res) => res.sendFile(path.join(__dirname, '../dist/index.html')));
//
// // catch 404 and forward to error handler
// app.use((req, res, next) => {
//   const err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
//
// // error handler
// app.use((err, req, res) => {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.local.error = req.app.get('env') === 'development' ? err : {};
//
//   // TODO: render the error page
//   res.status(err.status || 500);
//   res.json({ 'message': `${err.name} : ${err.message}` });
// });
//
module.exports = app;
