var express = require('express'),
  router = express.Router();

router.use('/token', require('./token'));

module.exports = router;