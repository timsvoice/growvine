'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	faker = require('faker'),
	User = mongoose.model('User'),
	Organization = mongoose.model('Organization'),
	Plant = mongoose.model('Plant'),	
	Order = mongoose.model('Order'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, order, organization, plant;

/**
 * Order routes tests
 */
describe('Order CRUD tests', function() {
	beforeEach(function(done) {
		// setup plant
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
		// setup organization
		organization = new Organization({
			type: 'vendor',
			name: faker.company.companyName(),
			description: faker.lorem.words(35),
			// owner: user._id,
			// members: [{
			// 	memberId: user._id,
			// 	memberPermission: 'admin'
			// }],
			mailingList: faker.lorem.words(1),
			plants: [plant._id],
			contact: {
				phone: 1234567890,
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
		// Create user
		user = new User({
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName(),
			email: faker.internet.email(),
			password: faker.internet.password(10),
			isAdmin: false,
			isOwner: true,
			organization: organization,
			provider: 'local'		
		});
		// user credentials
		credentials = {
			email: user.email ,
			password: user.password
		};
		user.save(function() { 
			order = new Order({
				orderNumber: faker.random.number(),
				shipTo: {
					firstName: user.firstName,
					lastName: user.lastName,					
					street: organization.contact.address.street,
					city: organization.contact.address.city,
					state: organization.contact.address.state,
					zip: organization.contact.address.zip					
				},
				vendor: organization,
				memo: faker.lorem.words(20),
				confirmed: false,
				invoiced: false,
				createdOrganization: organization,
				createdUser: user,
				plants: [plant],
			});

			done();
		});
	});

	it('should be able to save Order instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);
				// Get the userId
				var vendorId = organization.id;

				// Save a new Order
				agent.post('/orders')
					.send(order)
					.expect(200)
					.end(function(orderSaveErr, orderSaveRes) {
						// Handle Order save error
						if (orderSaveErr) done(orderSaveErr);
						// Get a list of Orders
						agent.get('/orders')
							.end(function(ordersGetErr, ordersGetRes) {
								// Handle Order save error
								if (ordersGetErr) done(ordersGetErr);

								// Get Orders list
								var orders = ordersGetRes.body;

								// Set assertions
								(orders[0].vendor).should.equal(vendorId);
								(orders[0].shipTo.street).should.equal(organization.contact.address.street);
								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Order instance if not logged in', function(done) {
		agent.post('/orders')
			.send(order)
			.expect(401)
			.end(function(orderSaveErr, orderSaveRes) {
				// Call the assertion callback
				done(orderSaveErr);
			});
	});

	it('should not be able to save Order instance if no plant is provided', function(done) {
		// Invalidate name field
		order.orderNumber = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);
				// Save a new Order
				agent.post('/orders')
					.send(order)
					.expect(400)
					.end(function(orderSaveErr, orderSaveRes) {
					
						// Set message assertion
						(orderSaveRes.body.message).should.match('Order must have an order number');
						
						// Handle Order save error
						done(orderSaveErr);
					});
			});
	});

	it('should be able to update Order instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Order
				agent.post('/orders')
					.send(order)
					.expect(200)
					.end(function(orderSaveErr, orderSaveRes) {
						// Handle Order save error
						if (orderSaveErr) done(orderSaveErr);


						// Update Order name
						order.confirmed = true;

						// Update existing Order
						agent.put('/orders/' + orderSaveRes.body._id)
							.send(order)
							.expect(200)
							.end(function(orderUpdateErr, orderUpdateRes) {
								// Handle Order update error
								if (orderUpdateErr) done(orderUpdateErr);
								// Set assertions
								(orderUpdateRes.body._id).should.equal(orderSaveRes.body._id);
								(orderUpdateRes.body.confirmed).should.equal(true);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to get a list of Orders if not signed in', function(done) {
		// Create new Order model instance
		var orderObj = new Order(order);

		// Save the Order
		orderObj.save(function() {
			// Request Orders
			request(app).get('/orders')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('message', 'User is not logged in');

					// Call the assertion callback
					done();
				});

		});
	});


	it('should not be able to get a single Order if not signed in', function(done) {
		// Create new Order model instance
		var orderObj = new Order(order);

		// Save the Order
		orderObj.save(function() {
			request(app).get('/orders/' + orderObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('message', 'User is not logged in');

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Order instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Order
				agent.post('/orders')
					.send(order)
					.expect(200)
					.end(function(orderSaveErr, orderSaveRes) {
						// Handle Order save error
						if (orderSaveErr) done(orderSaveErr);

						// Delete existing Order
						agent.delete('/orders/' + orderSaveRes.body._id)
							.send(order)
							.expect(200)
							.end(function(orderDeleteErr, orderDeleteRes) {
								// Handle Order error error
								if (orderDeleteErr) done(orderDeleteErr);

								// Set assertions
								(orderDeleteRes.body._id).should.equal(orderSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Order instance if not signed in', function(done) {
		// Set Order user 
		order.user = user;

		// Create new Order model instance
		var orderObj = new Order(order);

		// Save the Order
		orderObj.save(function() {
			// Try deleting Order
			request(app).delete('/orders/' + orderObj._id)
			.expect(401)
			.end(function(orderDeleteErr, orderDeleteRes) {
				// Set message assertion
				(orderDeleteRes.body.message).should.match('User is not logged in');

				// Handle Order error error
				done(orderDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Order.remove().exec();
		done();
	});
});