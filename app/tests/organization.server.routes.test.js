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
var credentials, user, organization, plant;

/**
 * Organization routes tests
 */
describe('Organization CRUD tests', function() {
	beforeEach(function(done) {

		user = new User({
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName(),
			email: faker.internet.email(),
			password: faker.internet.password(10),
			isAdmin: false,
			isOwner: true,
			// organization_id: organization._id,
			provider: 'local'		
		});
		// Create user credentials
		credentials = {
			email: user.email,
			password: user.password
		};

		plant = new Plant({
			orgOwner: faker.random.uuid(),
			commonName: faker.commerce.productName(),
			scientificName: faker.commerce.productMaterial(),
			unitSize: faker.commerce.productAdjective(),
			unitPrice: faker.commerce.price(),
			unitAvailability: [{
				date: new Date(),
				quantity: faker.random.number()
			}]
		});

		// Save a user to the test db and create new Organization
		user.save(function() { 
			organization = new Organization({
				type: 'vendor',
				name: faker.company.companyName(),
				description: faker.lorem.words(35),
				owner: user._id,
				members: [{
					memberId: user._id,
					memberPermission: 'admin'
				}],
				mailingList: faker.lorem.words(1),
				plants: [{
					plant_id: plant._id
				}],
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

			done();
		});
	});
	
	it('should be able to save Organization instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Organization
				agent.post('/organizations')
					.send(organization)
					.expect(200)
					.end(function(organizationSaveErr, organizationSaveRes) {
						// Handle Organization save error
						if (organizationSaveErr) done(organizationSaveErr);

						// Get a list of Organizations
						agent.get('/organizations')
							.end(function(organizationsGetErr, organizationsGetRes) {
								// Handle Organization save error
								if (organizationsGetErr) done(organizationsGetErr);

								// Get Organizations list
								var organizations = organizationsGetRes.body;

								// Set assertions
								(organizations[0].name).should.match(organization.name);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Organization instance if not logged in', function(done) {
		agent.post('/organizations')
			.send(organization)
			.expect(401)
			.end(function(organizationSaveErr, organizationSaveRes) {
				// Call the assertion callback
				done(organizationSaveErr);
			});
	});

	it('should not be able to save Organization instance if no name is provided', function(done) {
		// Invalidate name field
		organization.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Organization
				agent.post('/organizations')
					.send(organization)
					.expect(400)
					.end(function(organizationSaveErr, organizationSaveRes) {
						// Set message assertion
						(organizationSaveRes.body.message).should.match('Please fill Organization name');
						
						// Handle Organization save error
						done(organizationSaveErr);
					});
			});
	});

	it('should be able to update Organization instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Organization
				agent.post('/organizations')
					.send(organization)
					.expect(200)
					.end(function(organizationSaveErr, organizationSaveRes) {
						// Handle Organization save error
						if (organizationSaveErr) done(organizationSaveErr);

						// Update Organization name
						organization.name = 'WHY YOU GOTTA BE SO MEAN?';
						// Update existing Organization
						agent.put('/organizations/' + organizationSaveRes.body._id)
							.send(organization)
							.expect(200)
							.end(function(organizationUpdateErr, organizationUpdateRes) {
								// Handle Organization update error
								if (organizationUpdateErr) done('update error: ' + organizationUpdateErr);

								// Set assertions
								(organizationUpdateRes.body._id).should.equal(organizationSaveRes.body._id);
								(organizationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to get a list of Organizations if not signed in', function(done) {
		// Create new Organization model instance
		var organizationObj = new Organization(organization);

		// Save the Organization
		organizationObj.save(function() {
			// Request Organizations
			request(app).get('/organizations')
				.expect(400)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('message', 'User is not logged in');

					// Call the assertion callback
					done();
				});

		});
	});


	it('should not be able to get a single Organization if not signed in', function(done) {
		// Create new Organization model instance
		var organizationObj = new Organization(organization);

		// Save the Organization
		organizationObj.save(function() {
			request(app).get('/organizations/' + organizationObj._id)
				.expect(400)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('message', 'User is not logged in');

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Organization instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Organization
				agent.post('/organizations')
					.send(organization)
					.expect(200)
					.end(function(organizationSaveErr, organizationSaveRes) {
						// Handle Organization save error
						if (organizationSaveErr) done(organizationSaveErr);

						// Delete existing Organization
						agent.delete('/organizations/' + organizationSaveRes.body._id)
							.send(organization)
							.expect(200)
							.end(function(organizationDeleteErr, organizationDeleteRes) {
								// Handle Organization error error
								if (organizationDeleteErr) done(organizationDeleteErr);

								// Set assertions
								(organizationDeleteRes.body._id).should.equal(organizationSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Organization instance if not signed in', function(done) {
		// Set Organization user 
		organization.user = user;

		// Create new Organization model instance
		var organizationObj = new Organization(organization);

		// Save the Organization
		organizationObj.save(function() {
			// Try deleting Organization
			request(app).delete('/organizations/' + organizationObj._id)
			.expect(401)
			.end(function(organizationDeleteErr, organizationDeleteRes) {
				// Set message assertion
				(organizationDeleteRes.body.message).should.match('User is not logged in');

				// Handle Organization error error
				done(organizationDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Organization.remove().exec();
		done();
	});
});