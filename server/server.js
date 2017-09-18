let express = require('express')
  , app = express()
  , bodyParser = require('body-parser')
  , expressJWT = require('express-jwt')
  , config = require('./config')
  , logger = require('morgan')
  , expressValidator = require('express-validator');

app.use(function(req, res, next) {
  // set environment
  let env = config.environments.dev;

  if (process.env.NODE_ENV) {
    let env = process.env.NODE_ENV.trim().toLowerCase();
    app.env = req.env = ['development','production','test'].indexOf(env) > -1 ? env : config.environments.dev;
  }
  
  next();
});

if (app.env === config.environments.dev) {
  app.use(logger('dev'));
}

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(expressValidator({
  customValidators: require('./utilities/customValidators')
}));

app.use(expressJWT({secret: config.auth.token.secret, requestProperty: 'token'})
  .unless({path: ['/auth/token']}));

require('./routes')(app);

// error handlers catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler will print stacktrace
if (app.get('env') !== 'prod') {
  app
    .use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
}

// production error handler no stacktraces leaked to user
app
  .use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });

app.listen(3000);
console.log('api is running on port 3000');

module.exports = app;