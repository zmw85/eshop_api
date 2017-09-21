process.env.NODE_ENV = 'test';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server/server');
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

const validateResponse_clientCredentials_withRefreshToken = (err, res) => {
  res.should.have.status(200);
  res.body.should.be.a('object').that.have.property('token').that.be.a('string');
  res.body.should.have.property('expire').that.be.a('string');
  res.body.should.have.property('issuer').that.be.a('string');
  res.body.should.have.property('roles').that.be.a('array').that.have.members(['client']);

  res.body.should.have.property('refreshToken').that.be.a('object')
    .that.have.property('token').that.be.a('string');
  res.body.refreshToken.should.have.property('expire').that.be.a('string');
};
const validateResponse_clientCredentials_withoutRefreshToken = (err, res) => {
  res.should.have.status(200);
  res.body.should.be.a('object').that.have.property('token').that.be.a('string');
  res.body.should.have.property('expire').that.be.a('string');
  res.body.should.have.property('issuer').that.be.a('string');
  res.body.should.have.property('roles').that.be.a('array').that.have.members(['client']);
};
const validateResponse_password_withRefreshToken = (err, res) => {
  res.should.have.status(200);
  res.body.should.be.a('object').that.have.property('token').that.be.a('string');
  res.body.should.have.property('expire').that.be.a('string');
  res.body.should.have.property('issuer').that.be.a('string');
  res.body.should.have.property('roles').that.be.a('array').that.have.members(['client','user']);

  res.body.should.have.property('refreshToken').that.be.a('object')
    .that.have.property('token').that.be.a('string');
  res.body.refreshToken.should.have.property('expire').that.be.a('string');
};
const validateResponse_password_withoutRefreshToken = (err, res) => {
  res.should.have.status(200);
  res.body.should.be.a('object').that.have.property('token').that.be.a('string');
  res.body.should.have.property('expire').that.be.a('string');
  res.body.should.have.property('issuer').that.be.a('string');
  res.body.should.have.property('roles').that.be.a('array').that.have.members(['client','user']);
};

describe('/auth/token:', () => {
  const clientId_1 = 'system_admin'
    , clientSecret_1 = '31024eac281b11e785bf3f395f33dfc9'
    , clientId_2 = 'system_admin2'
    , clientSecret_2 = '51fcd216541811e7a156211c297bee38'
    , username = 'zmw85'
    , password = '123456'
  let refreshToken;

  // client_credenttials
  describe('POST: (grant_type: client_credentials)', () => {
    it('with refresh token: it should return json web token with refresh token', (done) => {
      chai.request(server)
        .post('/auth/token')
        .send({
          grant_type: 'client_credentials',
          client_id: clientId_1,
          client_secret: clientSecret_1
        })
        .end((err, res) => {
          validateResponse_clientCredentials_withRefreshToken(err, res);
          refreshToken = res.body.refreshToken.token;
          done();
        });
    });
    it('without refresh token: it should return json web token without refresh token', (done) => {
      chai.request(server)
        .post('/auth/token')
        .send({
          grant_type: 'client_credentials',
          client_id: clientId_2,
          client_secret: clientSecret_2
        })
        .end((err, res) => {
          validateResponse_clientCredentials_withoutRefreshToken(err, res);
          done();
        });
    });
  });

  describe('POST: (grant_type: refresh_token), for client_credentials', () => {
    it('it should return json web token weith a renewed refresh token', (done) => {
      chai.request(server)
        .post('/auth/token')
        .send({
          grant_type: 'refresh_token',
          client_id: clientId_1,
          client_secret: clientSecret_1,
          refresh_token: refreshToken
        })
        .end((err, res) => {
          validateResponse_clientCredentials_withRefreshToken(err, res);
          res.body.refreshToken.should.not.equal(refreshToken);
          done();
        });
    })
  });

  // password
  describe('POST: (grant_type: password)', () => {
    it('with refresh token: it should return json web token with refresh token', (done) => {
      chai.request(server)
        .post('/auth/token')
        .send({
          grant_type: 'password',
          client_id: clientId_1,
          client_secret: clientSecret_1,
          username: username,
          password: password
        })
        .end((err, res) => {
          validateResponse_password_withRefreshToken(err, res);
          refreshToken = res.body.refreshToken.token;
          done();
        });
    });
    it('without refresh token: it should return json web token without refresh token', (done) => {
      chai.request(server)
        .post('/auth/token')
        .send({
          grant_type: 'password',
          client_id: clientId_2,
          client_secret: clientSecret_2,
          username: username,
          password: password
        })
        .end((err, res) => {
          validateResponse_password_withoutRefreshToken(err, res);
          done();
        });
    });
  });

  describe('POST: (grant_type: refresh_token), for password', () => {
    it('it should return json web token weith a renewed refresh token', (done) => {
      chai.request(server)
        .post('/auth/token')
        .send({
          grant_type: 'refresh_token',
          client_id: clientId_1,
          client_secret: clientSecret_1,
          refresh_token: refreshToken
        })
        .end((err, res) => {
          validateResponse_password_withRefreshToken(err, res);
          res.body.refreshToken.should.not.equal(refreshToken);
          done();
        });
    })
  });

});