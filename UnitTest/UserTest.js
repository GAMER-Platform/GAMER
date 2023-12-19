/* CHUNG HAO 2023 dev */

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./server');
const should = chai.should();

chai.use(chaiHttp);

/*-----------------------測試 GET /api/users----------------------- */

describe('API Routes', () => {
 
  describe('GET /api/users', () => {
    it('it should GET all the users', (done) => {
      chai.request(server)
          .get('/api/users')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
            done();
          });
    });
  });

});