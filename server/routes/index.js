const resFuncs = require('../utilities/responseFunctions');

module.exports = app => {

  // assign respponse function
  app.use('', (req, res, next) => {
    let sendErrorBound = resFuncs.sendError.bind(res);
    res.sendError = sendErrorBound;
    next();
  });

  // authentication
  app.use('/auth', require('./auth'));

  // resources
  app.use('/api', require('./api'));

  app.route('/').get((req, res) => {
    res.render('index');
  })

  // 404
  app.use('/*', (req, res, next) => {
    return res
      .status(404)
      .json({status: 404, data: 'The requested resource could not be found.'})
      .end();
  });

  // error handling
  app.use((err, req, res, next) => {
    res
      .status(err.status || 500)
      .json({
        message: err.message,
        error: app.get('env') === 'dev'
          ? err
          : {}
      })
      .end();
  });

};
