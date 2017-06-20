var express = require('express'),
  router = express.Router();

// api resource authorisation middleware
router.use('', (req, res, next) => {
  console.log(req.token);
  next();
});

router.use('/users', require('./user'));

module.exports = router;