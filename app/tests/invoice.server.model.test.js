'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	faker = require('faker'),
	User = mongoose.model('User'),
	Organization = mongoose.model('Organization'),
	Plant = mongoose.model('Plant'),
	Order = mongoose.model('Order'),
	Invoice = mongoose.model('Invoice');

/**
 * Globals
 */
var user, invoice, plant, organization, user, order;

/**
 * Unit tests
 */
describe('Invoice Model Unit Tests:', function() {
	beforeEach(function(done) {
		// setup user
		user = new User({
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName(),
			displayName: faker.name.firstName() + faker.name.lastName(),
			email: faker.internet.email(),
			username: faker.internet.userName(),
			password: faker.internet.password()
		});
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
		// setup organization
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

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return invoice.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without invoicer', function(done) { 
			invoice.invoicer = '';

			return invoice.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Invoice.remove().exec();
		User.remove().exec();

		done();
	});
});