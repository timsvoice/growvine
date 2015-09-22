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
var credentials, user, image;

/**
 * Plant routes tests
 */
describe('Uploader tests', function() {
	beforeEach(function(done) {

		user = new User({			
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName(),
			email: faker.internet.email(),
			password: faker.internet.password(10),
			isAdmin: false,
			isOwner: true,
			provider: 'local',
			organization: '55d4d81cf7d70bff8252c325'
		});
		// Create user credentials
		credentials = {
			email: user.email,
			password: user.password
		};

		image = './app/tests/jws.png';

		user.save(done);

	});

	it('should be able to upload image file if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;
				// Save a new Plant
				request(app).post('/uploader/signing')
					.field('name', 'jws')
					.attach('image', image)
					.expect(200)
					.end(function(uploadErr, uploadRes) {
						// Handle Plant save error
						if (uploadErr) done(uploadErr);

						console.log(uploadRes.body);
						done();						
					});
			});
	});

	afterEach(function(done) {
		User.remove().exec();
		done();
	});
});