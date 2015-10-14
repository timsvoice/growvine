'use strict';

(function() {
	// Mailer Service Spec
	describe('Mailer Service Tests', function() {
		// Initialize global variables
		var Mailer,
			scope,
			$httpBackend,
			$stateParams,
			$location,
			user,
			mail;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function(_Mailer_, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;
			Mailer = _Mailer_;

		}));

		it('followRequest should send an email to the organization announcing the request', inject(function() {
			user = {
				_id: '525cf20451979dea2c000001',
				firstName: 'Fred',
				lastName: 'User',
				email: 'fred@mail.com',
				password: 'password',
				isAdmin: false,
				isOwner: true,
				organization: '525cf20451979dea2c000001',
				provider: 'local'			
			};
			$httpBackend.expect('GET', '/mailer/send').respond(200, {message: 'Queued, thank you.'});
			Mailer.service.followRequest(user, user, function (res) {				
				// expect the response to be a message saying queued				
				mail = res;
			})
			$httpBackend.flush();
			expect(mail.message).toBe('Queued, thank you.');
		}));
	});
}());