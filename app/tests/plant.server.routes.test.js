'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	agent = request.agent(app),
	faker = require('faker'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Organization = mongoose.model('Organization'),
	Plant = mongoose.model('Plant');

/**
 * Globals
 */
var credentials, user, plant, organization;

/**
 * Plant routes tests
 */
describe('Plant CRUD tests', function() {
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

		organization = new Organization({
			_id: '55d4d81cf7d70bff8252c325',
			type: 'vendor',
			name: faker.company.companyName(),
			description: faker.lorem.words(35),
			owner: user._id,
			members: [{
				memberId: user._id,
				memberPermission: 'admin'
			}],
			plants: [],
			mailingList: faker.lorem.words(1),
			contact: {
				phone: faker.phone.phoneNumber(),
				email: faker.internet.email(),
				website: faker.internet.url(),
				address: {
					street: faker.address.streetAddress(),
					city: faker.address.city(),
					state: faker.address.state(),
					zip: faker.address.zipCode()
				}
			}
		});

		// set user organization to orgObj
		// Save a user to the test db and create new Plant
		user.save(function() {
			plant = new Plant({
				organization: organization._id,
				commonName: faker.commerce.productName(),
				scientificName: faker.commerce.productMaterial(),
				unitSize: faker.commerce.productAdjective(),
				unitPrice: faker.commerce.price(),
				unitRoyalty: faker.commerce.price(),
				unitAvailability: [{
					date: new Date(),
					quantity: faker.random.number()
				}]
			});
			done();
		});
	});

	it('should be able to save Plant instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Plant
				agent.post('/plants')
					.send(plant)
					.expect(200)
					.end(function(plantSaveErr, plantSaveRes) {
						// Handle Plant save error
						if (plantSaveErr) done(plantSaveErr);

						// Get a list of Plants
						agent.get('/plants')
							.end(function(plantsGetErr, plantsGetRes) {
								// Handle Plant save error
								if (plantsGetErr) done(plantsGetErr);

								// Get Plants list
								var plants = plantsGetRes.body;

								// Set assertions
								// (plants[0].user._id).should.equal(userId);
								(plants[0].commonName).should.match(plant.commonName);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Plant instance if not logged in', function(done) {
		agent.post('/plants')
			.send(plant)
			.expect(401)
			.end(function(plantSaveErr, plantSaveRes) {
				// Call the assertion callback
				done(plantSaveErr);
			});
	});

	it('should not be able to save Plant instance if no name is provided', function(done) {
		// Invalidate name field
		plant.commonName = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Plant
				agent.post('/plants')
					.send(plant)
					.expect(400)
					.end(function(plantSaveErr, plantSaveRes) {
						// Set message assertion
						(plantSaveRes.body.message).should.match('Please fill common name');
						
						// Handle Plant save error
						done(plantSaveErr);
					});
			});
	});

	it('should be able to update Plant instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Plant
				agent.post('/plants')
					.send(plant)
					.expect(200)
					.end(function(plantSaveErr, plantSaveRes) {
						// Handle Plant save error
						if (plantSaveErr) done(plantSaveErr);

						// Update Plant name
						plant.commonName = faker.commerce.productName();
						// Update existing Plant
						agent.put('/plants/' + plantSaveRes.body._id)
							.send(plant)
							.expect(200)
							.end(function(plantUpdateErr, plantUpdateRes) {
								// Handle Plant update error
								if (plantUpdateErr) done('plant update error: ' + plantUpdateErr);

								// Set assertions
								(plantUpdateRes.body._id).should.equal(plantSaveRes.body._id);
								(plantUpdateRes.body.commonName).should.match(plant.commonName);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Plants if not signed in', function(done) {
		// Create new Plant model instance
		var plantObj = new Plant(plant);

		// Save the Plant
		plantObj.save(function() {
			// Request Plants
			request(app).get('/plants')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Plant if not signed in', function(done) {
		// Create new Plant model instance
		var plantObj = new Plant(plant);

		// Save the Plant
		plantObj.save(function() {
			request(app).get('/plants/' + plantObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('commonName', plant.commonName);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Plant instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Plant
				agent.post('/plants')
					.send(plant)
					.expect(200)
					.end(function(plantSaveErr, plantSaveRes) {
						// Handle Plant save error
						if (plantSaveErr) done(plantSaveErr);
						// Delete existing Plant
						agent.delete('/plants/' + plantSaveRes.body._id)
							.send(plant)
							.expect(200)
							.end(function(plantDeleteErr, plantDeleteRes) {
								// Handle Plant error error
								if (plantDeleteErr) done('plant del error: ' + plantDeleteErr);

								// Set assertions
								(plantDeleteRes.body._id).should.equal(plantSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Plant instance if not signed in', function(done) {
		// Set Plant user 
		plant.user = user;

		// Create new Plant model instance
		var plantObj = new Plant(plant);

		// Save the Plant
		plantObj.save(function() {
			// Try deleting Plant
			request(app).delete('/plants/' + plantObj._id)
			.expect(401)
			.end(function(plantDeleteErr, plantDeleteRes) {
				// Set message assertion
				(plantDeleteRes.body.message).should.match('User is not logged in');

				// Handle Plant error error
				done(plantDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Plant.remove().exec();
		done();
	});
});