'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	faker = require('faker'),
	Organization = mongoose.model('Organization'),
	User = mongoose.model('User'),
	Plant = mongoose.model('Plant');

/**
 * Globals
 */
var user, plant, organization;

/**
 * Unit tests
 */
describe('Plant Model Unit Tests:', function() {
	beforeEach(function(done) {
		
		user = new User({
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName(),
			displayName: faker.name.firstName() + faker.name.lastName(),
			email: faker.internet.email(),
			username: faker.internet.userName(),
			password: faker.internet.password()
		});
		
		organization = new Organization({
			name: faker.company.companyName(),
			user: user._id
		})

		user.save(function() { 
			plant = new Plant({
				orgOwner: organization._id,
				commonName: faker.commerce.productName(),
				scientificName: faker.commerce.productMaterial(),
				unitSize: faker.commerce.productAdjective(),
				unitPrice: faker.commerce.price(),
				unitAvailability: [{
					date: new Date(),
					quantity: faker.random.number()
				}]
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return plant.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			plant.commonName = '';
			return plant.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Plant.remove().exec();
		User.remove().exec();
		Organization.remove().exec();
		done();
	});
});