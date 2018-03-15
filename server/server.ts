require('zone.js/dist/zone-node');
require('reflect-metadata');

if (process.env.NODE_ENV !== `production`) {
  process.env.NODE_ENV = `development`;
}

// import { enableProdMode } from '@angular/core';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import { router } from './api/routes';

const express = require('express');
const session = require('express-session');
const platformServer = require('@angular/platform-server');
const ngUniversal = require('@nguniversal/express-engine');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSanitizer = require('express-sanitizer');
const passport = require('passport');
const fs = require('fs');
const compression = require('compression');
const jwt = require('express-jwt');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

const keyConfig = require('./api/config/keys.js');

const DIST_FOLDER = path.join(process.cwd(), './dist');
const template = fs.readFileSync(path.join(DIST_FOLDER, 'client', 'index.html'));
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('../dist/server/main.bundle');

const PORT = process.env.PORT || 3000;

const auth = jwt({
  secret: `${keyConfig.JWT_SECRET}`,
  userProperty: 'payload'
});

// mongoose models
require('./api/models/db.js');

// services
require('./api/services/passport.js');

// connect mongoDB
if (keyConfig.mongoURI) {
  mongoose.connect(keyConfig.mongoURI);
}

// enableProdMode();

function angularRouter(req, res) {
  res.render('index', { req, res });
}

// set Express
const app = express();

// set CORS headers
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Key, Authorization');
  next();
});


app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));
app.set('view engine', 'html');
app.set('views', path.join(DIST_FOLDER, 'client'));

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  session({
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000
    },
    secret: keyConfig.cookieKey,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      collection: 'session'
    })
  })
);

// middlewares
app.use(expressSanitizer());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

app.get('/', angularRouter);
app.get('/login', angularRouter);

app.use('/api', router);
// app.use('/auth', authRoutes);
// app.use('/prod', productRoutes);
// app.use('/cartApi', cartRoutes);
// app.use('/admin', adminRoutes);


app.get('*.*', express.static(path.join(DIST_FOLDER, 'client')));

// app.use(express.static(`${__dirname}/../dist/client`));

app.get('*', (req, res) => {
  res.render(path.join(DIST_FOLDER, 'client', 'index.html'), { req });
});

// compress files
app.use(compression());

app.get('*', angularRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err: { status?: number, message: string } = new Error('Not Found');
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

app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}!`);
});

//////////////////
// mongoose.connect(`${process.env.MONGO_URI}`)
//   .then(() => console.log(`App connected to MongoDB`))
//   .catch((err) => {
//     console.error(`App starting error: ${err.stack}`);
//     process.exit(1);
//   });
//
// const app = express();
//
// const apiRoutes = require('./api/routes/app');
// const db = require('./api/models/db');
// const services = require('./api/services/passport');
// const auth = jwt({
//   secret: `${process.env.JWT_SECRET}`,
//   userProperty: 'payload'
// });
//
// // view engine setup
// app.set('view', path.join(__dirname, '../client/views'));
// app.set('view engine', 'hbs');
//
// // uncomment after placing your favorite favicon in client
// // app.use(favicon(path.join(__dirname, '../client/src', 'favicon.ico')));
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, '../dist')));
//
// // sanitizer
// app.use(passport.initialize());
// app.use('/api', apiRoutes);
//
// app.use('*', (req, res) => res.sendFile(path.join(__dirname, '../dist/index.html')));
//

//
// module.exports = app;
