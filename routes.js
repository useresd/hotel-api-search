const express = require('express');
const router = express.Router();
const controllers = require('./controllers')

router.get('/hotels', controllers.hotel.index);

module.exports = router;