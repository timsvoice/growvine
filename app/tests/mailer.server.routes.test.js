'use strict';

var should = require('should'),
  request = require('supertest'),
  app = require('../../server'),
  agent = request.agent(app),
  faker = require('faker'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

/**
 * Globals
 */
var credentials, user;

/**
 * Plant routes tests
 */
describe('Mailer tests', function() {
  beforeEach(function(done) {

    user = new User({     
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: 'timsethvoice@gmail.com',
      password: faker.internet.password(10),
      isAdmin: false,
      isOwner: true,
      provider: 'local',
      role: 'vendor',
      organization: '55d4d81cf7d70bff8252c325'
    });
    // Create user credentials
    credentials = {
      email: user.email,
      password: user.password
    };

    user.save(done);

  });

  it('should be able inline an email and send a mailing object back', function(done) {
    agent.get('/mailer/create')
      .expect(200)
      .send({
        users: [user],
        template: 'test'
      })
      .end(function(mailerErr, mailerRes) {
        
        if (mailerErr) console.log(mailerErr)
        
        mailerRes.body.should.be.an.Array.with.length(1);

        done();
      });
  });

  it('should be able to send an email using specified template', function(done) {
    agent.get('/mailer/send')
      .expect(200)
      .send({
        users: [user],
        subject: user.firstName + " wants to see your availability!",
        template: 'follow.request',
        variables: {
          requesterName: user.firstName,           
          ownerName: user.firstName
        }
      })
      .end(function(mailerErr, mailerRes) {
        if (mailerErr) done(mailerErr)
        mailerRes.body.should.be.an.Object.with.property('message', 'Queued. Thank you.');
        done();
      });
  });

  afterEach(function(done) {
    User.remove().exec();
    done();
  });
});