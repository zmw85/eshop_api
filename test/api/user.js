process.env.NODE_ENV = 'test';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server/server');
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

describe('/api/users', () => {
  // get all users with or without filters
  describe('GET:', () => {
    it('without any filter', (done) => {
      chai.request(server)
        .get('/api/users')
        .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfaWQiOjEsInVzZXJfaWQiOiI2OTVjN2QyYzJjZDUxMWU3ODM0YzllZjNlN2FkYWE0ZCIsInJvbGVzIjpbInVzZXIiLCJjbGllbnQiXSwiaWF0IjoxNTA1OTg0MDU0LCJleHAiOjE1MDU5ODc2NTR9.cvqJsgSfCLO9n5y6yyKcGUooVuf6KkMxCwk_kjZ0AFM')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          // res.body.should.have.property('expire').that.be.a('string');
          // res.body.should.have.property('issuer').that.be.a('string');
          // res.body.should.have.property('roles').that.be.a('array').that.have.members(['client','user']);

          done();
        });
    });
  });
});