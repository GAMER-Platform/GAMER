const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./server');
const should = chai.should();

chai.use(chaiHttp);


/*-----------------------測試 /signup----------------------- */

describe('API Routes', () => {
describe('POST /signup', () => {
    it('it should POST a user ', (done) => {
      let user = {
          name: "Test User",
          email: "testuser@gmail.com",
          password: "password",
          profession: "使用者"
      }
      chai.request(server)
          .post('/signup')
          .send(user)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('User added successfully!');
            done();
          });
    });
  });
});
