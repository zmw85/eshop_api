var express = require('express')
  , jwt = require('jsonwebtoken')
  , config = require('../../config')
  , moment = require('moment')
  , $seq = require('../../models');

// grant types,
const CLIENT_CREDENTIALS = 'client_credentials'
  , PASSWORD = 'password'
  , REFRESH_TOKEN = 'refresh_token'
  , GRANT_TYPES = [CLIENT_CREDENTIALS, PASSWORD, REFRESH_TOKEN];

var router = express.Router();
var client = {};

router.post('', (req, res, next) => {
  var grantType = req.body.grant_type;

  validateGrantType(grantType).then(() => {
    return grantByClientCredentials(grantType, req.body.client_id, req.body.client_secret, res);
  }).then(result => {
    return grantByPassword(grantType, result, req.body.username, req.body.password);
  }).then(result => {
    return grantByRefreshToken(grantType, result, req.body.refresh_token);
  }).then(result => {
    result.issuer = config.auth.token.issuer;
    res.status(200).send(result).end();
  }).catch(err => {
    if (err instanceof Error) {
      console.log(err);
      return res.sendError(500, 'Service internal error');
    } else {
      return res.sendError(err.status, err.errors);
    }
  });
});

const validateGrantType = (grantType) => {
  return new Promise((resolve, reject) => {
    if (!grantType) {
      reject({status: 400, errors: ['Missing grant type']});
    }
    
    grantType = grantType.trim().toLowerCase();

    if (GRANT_TYPES.indexOf(grantType) < 0) {
      reject({status: 400, errors: ['Invalid grant type']});
    }

    resolve();
  });
}

const grantByClientCredentials = (grantType, client_id, client_secret) => {
  const p = new Promise((resolve, reject) => {
    if (!client_id || !client_secret) {
      var missing = !client_id ? 'id' : 'secret';
      reject({status: 400, errors: [`Missing client_${missing}`]});
    }
    resolve();
  });
  
  return p.then(() => {
    return $seq.clients.findOneByKeySecret(client_id, client_secret);
  }).then(result => {
    if (!result) {
      throw {status: 400, errors: ['Invalid client credentials']};
    }
    
    client = result.dataValues;
    var response = { noRefreshToken: true };

    if (grantType === CLIENT_CREDENTIALS && client.refreshToken) {
      return generateRefreshToken();
    } else {
      return null;
    }
  }).then((result) => {
    let refreshToken = result ? result.dataValues : null;

    let response = {};
    let roles = ['client'];

    if (grantType == CLIENT_CREDENTIALS) {
       let token = jwt.sign(
        { client_id: client.id, roles: roles }
        , config.auth.token.secret
        , {expiresIn: ttl}
      );

      response.token = token;
      response.expire = moment.utc().add(client.tokenLength, "m");
      var ttl = client.tokenLength * 60;

      response.roles = roles;

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

const grantByPassword = (grantType, prevResult, username, password) => {
  if (grantType !== PASSWORD) {
    return new Promise((resolve, reject) => {
      resolve(prevResult);
    })
  }

  return new Promise((resolve, reject) => {
    if (!username || !password) {
      var missing = !username ? 'username' : 'password';
      reject({status: 400, errors: [`Missing ${missing}`]});
    }
    resolve();
  }).then(() => {
    return $seq.users.findOneByUserNamePassword(username, password);
  }).then((result) => {
    if (!result) {
      throw {status: 400, errors: ['Invalid user name or password']};
    }

    var user = result.dataValues;
    
    if (user.status != 'active') {
      throw {status: 400, errors: ['Your user account is inactive']};
    }
    
    let roles = ['user', 'client'];

    let token = jwt.sign(
      { client_id: client.id, user_id: user.id, roles: roles }, 
      config.auth.token.secret, 
      {expiresIn: client.userTokenLength * 60}
    );
    prevResult.token = token;
    prevResult.expire = moment.utc().add(client.userTokenLength, 'm');
    prevResult.userId = user.id;
    //roles.push('xxx');
    prevResult.roles = roles;

    if (client.userRefreshToken) {
      return generateRefreshToken(user.id);
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

const grantByRefreshToken = (grantType, prevResult, refreshToken) => {
  if (grantType !== REFRESH_TOKEN) {
    return new Promise((resolve, reject) => {
      resolve(prevResult);
    })
  }

  return new Promise((resolve, reject) => {
    if (!refreshToken) {
      reject({status: 400, errors: ['Missing refresh_token']});
    }
    resolve();
  }).then(() => {
    return $seq.refreshTokens.findValidOneByClientIdToken(client.id, refreshToken);
  }).then((result) => {
    if (!result) {
      throw {status: 400, errors: ['Invalid refresh token']};
    }

    let refreshTokenRecord = result.dataValues;
    let tokenLength = refreshTokenRecord.userId ? client.userTokenLength : client.tokenLength;
    let useRefreshToken = refreshTokenRecord.userId ? client.refreshToken : client.userRefreshToken;

    let claims = { client_id: client.id };
    let roles = ['client'];

    if (refreshTokenRecord.userId) {
      claims.user_id = refreshTokenRecord.userId;
      roles.push('user');
    }
    claims.roles = roles;

    let token = jwt.sign(
      claims, 
      config.auth.token.secret, 
      {expiresIn: tokenLength * 60}
    );
    prevResult.token = token;
    prevResult.expire = moment.utc().add(tokenLength, 'm');
    prevResult.userId = refreshTokenRecord.userId || undefined;
    prevResult.roles = roles;

    if (useRefreshToken) {
      return Promise.all([
        $seq.refreshTokens.expireRefreshToken(client.id, refreshToken),
        generateRefreshToken(refreshTokenRecord.userId)
      ]);
    }
    
    return null;
  }).then(result => {
    const generateResult = result[1];

    if (generateResult) {
      prevResult.refreshToken = {
        token: generateResult.dataValues.token,
        expire: generateResult.dataValues.expireAt
      };
    }
    
    return prevResult;
  });
}

const generateRefreshToken = (userId) => {
  let refreshToken = {
    clientId: client.id,
    createdAt: moment.utc(),
    expireAt: moment.utc().add(userId ? client.userRefreshTokenLength : client.refreshTokenLength, 'm')
  }
  if (userId != undefined && userId != null) {
    refreshToken.userId = userId;
  }
  return $seq.refreshTokens.create(refreshToken);
}

module.exports = router;
