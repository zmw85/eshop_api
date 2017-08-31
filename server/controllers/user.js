const $seq = require('../models');

let userControllers = {
  get_users: function(req, res) {

    req.check('offset', 'Invalid offset').optional().isInt();
    req.sanitize('offset').toInt();

    req.check('limit', 'Invalid limit').optional().isInt();
    req.sanitize('limit').toInt();

    req.getValidationResult().then(function(result) {
      if (!result.isEmpty()) {
        return res.sendError(400, result.array().map(item => {
          return item.msg;
        }));
      } else {
        let params = {
          offset: req.query.offset,
          limit: req.query.limit
        };

        if (req.query.attributes) {
          params.attributes = req.query.attributes.split(',');
        }

        $seq.users.findUsers(params).then(result => {
          return res.send(result).end();
        })
        .catch(err => {
          return res.sendErrors(500, 'Service internal error');
        })
      }
    });
  }
}

module.exports = userControllers;
