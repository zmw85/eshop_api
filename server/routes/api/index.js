let express = require('express'),
  router = express.Router(),
  config = require('../../config');

// api resource authorisation middleware
router.use('', (req, res, next) => {
  if (req.env === config.environments.dev) {
    console.log(req.token);
  }  
  next();
});

router.use('/users', require('./user'));

module.exports = router;