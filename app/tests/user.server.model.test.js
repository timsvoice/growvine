'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	faker = require('faker'),
	User = mongoose.model('User'),
	Organization = mongoose.model('Organization');

/**
 * Globals
 */
var user, user2, organization;

/**
 * Unit tests
 */
describe('User Model Unit Tests:', function() {
	before(function(done) {
		organization = new Organization({
			type: 'vendor',
			name: faker.company.companyName(),
			description: faker.lorem.words(35),
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
		user2 = new User({
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName(),
			email: user.email,
			password: faker.internet.password(),
			isAdmin: false,
			isOwner: true,
			// organization_id: organization._id,
			provider: 'local'			
		});

		done();
	});

	describe('Method Save', function() {
		it('should begin with no users', function(done) {
			User.find({}, function(err, users) {
				users.should.have.length(0);
				done();
			});
		});

		it('should be able to login without problems', function(done) {
			user.save(done);
		});

		it('should fail to save an existing user again', function(done) {
			user.save();
			return user2.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without email', function(done) {
			user.email = null;
			console.log(user);
			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	after(function(done) {
		User.remove().exec();
		done();
	});
});