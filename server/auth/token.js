var express = require('express');
var jwt = require('jsonwebtoken');
var config = require('../config');
var moment = require('moment');

var router = express.Router();

router.use('/token', (req, res, next) => {
    let invalidGrantType = false;

    if (req.body.grant_type == 'client_credentials') {
        if (req.body.client_id && req.body.client_secret) {
            if (req.body.client_id == "admin" && req.body.client_secret == 'password') {
                let token = jwt.sign({
                    iss: config.auth.token.issuer,
                    client_id: req.body.client_id
                }, config.auth.token.secret, {expiresIn:config.auth.token.ttl});
                res.status(200).send({
                    token: token,
                    issuer: config.auth.token.issuer,
                    client_id: req.body.client_id,
                    expire: moment.utc().add(config.auth.token.ttl, 's')
                }).end();
            }
        }
    } else {
        invalidGrantType = true;
    }

    if (invalidGrantType) {
        res.status(400).send({status: 400, error: 'Invalid grant_type'});
    }
});

module.exports = router;