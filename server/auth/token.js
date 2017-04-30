var express = require('express');
var jwt = require('jsonwebtoken');
var config = require('../config');
var moment = require('moment');
var $seq = require('../models');

// grant types
const CLIENT_CREDENTIALS = 'client_credentials';
const PASSWORD = 'password';
const REFRESH_TOKEN = 'refresh_token';
const GRANT_TYPES = [CLIENT_CREDENTIALS, PASSWORD, REFRESH_TOKEN];

var router = express.Router();
var client = {};

router.post('/token', (req, res, next) => {
  var grantType = req.body.grant_type;

  validateGrantType(grantType).then(() => {
    return grantClientCredentials(grantType, req.body.client_id, req.body.client_secret, res);
  }).then((result) => {
    return grantPassword(grantType, result, req.body.username, req.body.password);
  }).then((result) => {
    result.issuer = config.auth.token.issuer;
    res.status(200).send(result).end();
  }).catch(err => {
    if (err instanceof Error) {
      console.log(err);
      res.status(500).send({status: 500, error: 'Service internal error'}).end();
    } else {
      res.status(err.status).send(err).end();
    }
  });
});

const validateGrantType = (grantType) => {
  return new Promise((resolve, reject) => {
    if (!grantType) {
      reject({status: 400, error: 'Missing grant type'});
    }
    
    grantType = grantType.trim().toLowerCase();

    if (GRANT_TYPES.indexOf(grantType) < 0) {
      reject({status: 400, error: 'Invalid grant type'});
    }

    resolve();
  });
}

const grantClientCredentials = (grantType, client_id, client_secret) => {
  const p = new Promise((resolve, reject) => {
    if (!client_id || !client_secret) {
      var missing = !client_id ? 'id' : 'secret';
      reject({status: 400, error: `Missing client_${missing}`});
    }
    resolve();
  });
  
  return p.then(() => {
    return $seq.clients.findOneByKeySecret(client_id, client_secret);
  }).then(result => {
    if (!result) {
      throw {status: 400, error: 'Invalid client credentials'};
    }
    
    client = result.dataValues;
    var response = { noRefreshToken: true };

    if (grantType === CLIENT_CREDENTIALS && client.refreshToken) {
      return generateRefreshToken(client);
    } else {
      return null;
    }
  }).then((result) => {
    let refreshToken = result ? result.dataValues : null;

    var response = {};

    if (grantType == CLIENT_CREDENTIALS) {
       let token = jwt.sign(
        Object.assign({}, response, { client_id: client_id })
        , config.auth.token.secret
        , {expiresIn: ttl}
      );

      response.token = token;
      response.expire = moment.utc().add(client.tokenLength, 'm');
      var ttl = client.tokenLength * 60;

      if (refreshToken) {
        response.refreshToken = {
          token: refreshToken.token,
          expire: refreshToken.expireAt
        };
      }
    }

    return response;
  });
}

const grantPassword = (grantType, prevResult, username, password) => {
  if (grantType !== PASSWORD) {
    return new Promise((resolve, reject) => {
      resolve(prevResult);
    })
  }

  return new Promise((resolve, reject) => {
    if (!username || !password) {
      var missing = !username ? 'username' : 'password';
      reject({status: 400, error: `Missing ${missing}`});
    }
    resolve();
  }).then(() => {
    return $seq.users.findOneByUserNamePassword(username, password);
  }).then((result) => {
    if (!result) {
      throw {status: 400, error: 'Invalid user name or password'};
    }

    var user = result.dataValues;
    
    if (user.status != 'active') {
      throw {status: 400, error: 'Your user account is inactive'};
    }

    let token = jwt.sign(prevResult, config.auth.token.secret, {expiresIn: client.userTokenLength * 60});
    prevResult.token = token;
    prevResult.expire = moment.utc().add(client.userTokenLength, 'm');
    prevResult.userId = user.id;

    if (client.userRefreshToken) {
      return generateRefreshToken(user);
    }
    
    return null;
  }).then(result => {

    if (result) {
      prevResult.refreshToken = {
        token: result.dataValues.token,
        expire: result.dataValues.expireAt
      };
    }
    
    return prevResult;
  });
  
}

const grantRefreshToken = (grantType, prevResult, refreshToken) => {

}

const generateRefreshToken = (user) => {
  let refreshToken = {
    clientId: client.id,
    createdAt: moment.utc(),
    expireAt: moment.utc().add(client.refreshTokenLength, 'm')
  }
  if (user) {
    refreshToken.userId = user.id;
  }
  return $seq.refreshTokens.create(refreshToken);
}

module.exports = router;
