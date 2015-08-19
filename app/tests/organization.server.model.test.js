'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	faker = require('faker'),
	User = mongoose.model('User'),
	Organization = mongoose.model('Organization'),
	Plant = mongoose.model('Plant');

/**
 * Globals
 */
var user, organization, plant;

/**
 * Unit tests
 */
describe('Organization Model Unit Tests:', function() {
	beforeEach(function(done) {

		user = new User({
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName(),
			displayName: faker.name.firstName() + faker.name.lastName(),
			email: faker.internet.email(),
			username: faker.internet.userName(),
			password: faker.internet.password()
		});

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

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return organization.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			organization.name = '';

			return organization.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Organization.remove().exec();
		User.remove().exec();
		Plant.remove().exec();
		done();
	});
});