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
	Order = mongoose.model('Order');

/**
 * Globals
 */
var user, order, organization, plant;

/**
 * Unit tests
 */
describe('Order Model Unit Tests:', function() {
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

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return order.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without orderNumber', function(done) { 
			order.orderNumber = '';

			return order.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('should be able to show an error when try to save without vendor', function(done) { 
			order.vendor = '';

			return order.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('should be able to show an error when try to save without createdBy', function(done) { 
			order.createdOrganization = '';

			return order.save(function(err) {
				should.exist(err);
				done();
			});
		});
		// it('should be able to show an error when try to save without plants', function(done) { 
		// 	order.plants = '';

		// 	return order.save(function(err) {
		// 		should.exist(err);
		// 		done();
		// 	});
		// });		
	});

	afterEach(function(done) { 
		Order.remove().exec();
		User.remove().exec();

		done();
	});
});