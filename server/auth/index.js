var express = require('express');

var router = express.Router();

router.use('/auth', require('./token'));

module.exports = router;