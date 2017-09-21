let express = require('express'),
  router = express.Router(),
  userControllers = require('../../controllers/user');

// api resource routes
router.get('', userControllers.get_users);

module.exports = router;