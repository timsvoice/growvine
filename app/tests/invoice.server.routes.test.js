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
	Invoice = mongoose.model('Invoice'),
	agent = request.agent(app);

/**
 * Globals
 */
var user, invoice, plant, organization, user, order, credentials;

/**
 * Invoice routes tests
 */
describe('Invoice CRUD tests', function() {
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
			description: faker.lorem.words(5),
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
		// Create user credentials
		credentials = {
			email: user.email,
			password: user.password
		};
		order = new Order({
			// orderNumber: faker.random.number(),
			shipTo: {
				firstName: user.firstName,
				lastName: user.lastName,					
				street: faker.address.streetAddress(),
				city: faker.address.city(),
				state: faker.address.state(),
				zip: faker.address.zipCode()					
			},
			vendor: organization,
			memo: faker.lorem.words(120),
			confirmed: false,
			invoiced: false,
			createdUser: user,
			createdOrganization: organization,
			plants: [plant],
		});
		// Save a user to the test db and create new Invoice
		user.save(function() {
			invoice = new Invoice({
				createdUser: user,
				invoicer: organization,
				invoicee: organization,
				amount: plant.unitPrice,
				discount: 10,
				markup: 20,
				taxes: {
					federalTaxes: 8.44
				},
				terms: {
					days: 30
				},
				paid: false,
				plants: [plant],
				order: order				
			});

			done();
		});
	});

	it('should be able to save Invoice instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Invoice
				agent.post('/invoices')
					.send(invoice)
					.expect(200)
					.end(function(invoiceSaveErr, invoiceSaveRes) {
						// Handle Invoice save error
						if (invoiceSaveErr) done(invoiceSaveErr);

						// Get a list of Invoices
						agent.get('/invoices')
							.end(function(invoicesGetErr, invoicesGetRes) {
								// Handle Invoice save error
								if (invoicesGetErr) done(invoicesGetErr);

								// Get Invoices list
								var invoices = invoicesGetRes.body;

								// Set assertions
								(invoices[0].createdUser).should.equal(userId);
								(invoices[0].amount).should.match(invoice.amount);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Invoice instance if not logged in', function(done) {
		agent.post('/invoices')
			.send(invoice)
			.expect(401)
			.end(function(invoiceSaveErr, invoiceSaveRes) {
				// Call the assertion callback
				done(invoiceSaveErr);
			});
	});

	it('should not be able to save Invoice instance if no terms are provided', function(done) {
		// Invalidate name field
		invoice.terms = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Save a new Invoice
				agent.post('/invoices')
					.send(invoice)
					.expect(400)
					.end(function(invoiceSaveErr, invoiceSaveRes) {
						// Set message assertion
						(invoiceSaveRes.body.message).should.match('Invoice must have terms');
						
						// Handle Invoice save error
						done(invoiceSaveErr);
					});
			});
	});

	it('should be able to update Invoice instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Save a new Invoice
				agent.post('/invoices')
					.send(invoice)
					.expect(200)
					.end(function(invoiceSaveErr, invoiceSaveRes) {
						// Handle Invoice save error
						if (invoiceSaveErr) done(invoiceSaveErr);

						// Update Invoice name
						invoice.paid = true;

						// Update existing Invoice
						agent.put('/invoices/' + invoiceSaveRes.body._id)
							.send(invoice)
							.expect(200)
							.end(function(invoiceUpdateErr, invoiceUpdateRes) {
								// Handle Invoice update error
								if (invoiceUpdateErr) done(invoiceUpdateErr);

								// Set assertions
								(invoiceUpdateRes.body._id).should.equal(invoiceSaveRes.body._id);
								(invoiceUpdateRes.body.paid).should.equal(true);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Invoices if not signed in', function(done) {
		// Create new Invoice model instance
		var invoiceObj = new Invoice(invoice);

		// Save the Invoice
		invoiceObj.save(function() {
			// Request Invoices
			request(app).get('/invoices')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('message', 'User is not logged in');

					// Call the assertion callback
					done();
				});

		});
	});

	it('should be able to get a list of invoices if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);
				// Create new Order model instance
				var invoiceObj = new Invoice(invoice);
				// Save the invoice
				invoiceObj.save(function() {
					// Request invoices
					agent.get('/invoices')
						.end(function(req, res) {
							// Set assertion
							res.body[0].should.be.an.Object.with.property('createdUser', String(user._id));
							// Call the assertion callback
							done();
						});

				});
			});
	});

	it('should not be able to get a single Invoice if not signed in', function(done) {
		// Create new Invoice model instance
		var invoiceObj = new Invoice(invoice);

		// Save the Invoice
		invoiceObj.save(function() {
			request(app).get('/Invoices/' + invoiceObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('message', 'User is not logged in');

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to get a single invoice if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);
				// Create new invoice model instance
				var invoiceObj = new Invoice(invoice);
				// Save the invoice
				// Save a new invoice
				agent.post('/invoices')
					.send(invoiceObj)
					.expect(200)
					.end(function(invoiceSaveErr, invoiceSaveRes) {
						// Handle invoice save error
						if (invoiceSaveErr) done(invoiceSaveErr);
						// Get a list of invoices
						agent.get('/invoices/' + invoiceObj._id)
							.end(function(invoicesGetErr, invoicesGetRes) {
								// Handle invoice save error
								if (invoicesGetErr) done(invoicesGetErr);

								// Get invoices list
								var invoice = invoicesGetRes.body;
								// Set assertions
								(invoice.createdUser).should.equal(String(user._id));
								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to delete Invoice instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Invoice
				agent.post('/invoices')
					.send(invoice)
					.expect(200)
					.end(function(invoiceSaveErr, invoiceSaveRes) {
						// Handle Invoice save error
						if (invoiceSaveErr) done(invoiceSaveErr);

						// Delete existing Invoice
						agent.delete('/invoices/' + invoiceSaveRes.body._id)
							.send(invoice)
							.expect(200)
							.end(function(invoiceDeleteErr, invoiceDeleteRes) {
								// Handle Invoice error error
								if (invoiceDeleteErr) done(invoiceDeleteErr);

								// Set assertions
								(invoiceDeleteRes.body._id).should.equal(invoiceSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Invoice instance if not signed in', function(done) {
		// Set Invoice user 
		invoice.user = user;

		// Create new Invoice model instance
		var invoiceObj = new Invoice(invoice);

		// Save the Invoice
		invoiceObj.save(function() {
			// Try deleting Invoice
			request(app).delete('/invoices/' + invoiceObj._id)
			.expect(401)
			.end(function(invoiceDeleteErr, invoiceDeleteRes) {
				// Set message assertion
				(invoiceDeleteRes.body.message).should.match('User is not logged in');

				// Handle Invoice error error
				done(invoiceDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Invoice.remove().exec();
		Plant.remove().exec();
		Organization.remove().exec();
		Order.remove().exec();
		done();
	});
});