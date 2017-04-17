var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var expressJWT = require('express-jwt');
var config = require('./config');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
    expressJWT({secret: config.auth.token.secret})
    .unless({path:['/auth/token']})
);
require('./routes')(app);

app.listen(3000);
console.log('api is running on port 3000')
