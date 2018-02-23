'use strict';

const express = require('express');
const router = express.Router();

const api = require('./api');
const user = require('./user');
// Add additional routes here

/* GET home page */
router.get('/', (req, res) => {
  res.send('API Works!');
});

router.use('/api', api);
router.use('/user', user);


module.exports = router;
