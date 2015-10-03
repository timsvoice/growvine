'use strict';

(function() {
	// Followers Controller Spec
	describe('Followers Controller Tests', function() {
		// Initialize global variables
		var FollowersController,
			scope,
			$httpBackend,
			$stateParams,
			$location,
			Followers,
			user,
			sampleOrganization,
			sampleOrganizationResponse;

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
		beforeEach(inject(function(_Followers_, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;
			Followers = _Followers_;

		}));

		beforeEach(function(){
			// set user
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
			}

			sampleOrganization = {
				_id: '525cf20451979dea2c000345',
				type: 'vendor',
				name: 'Organization Name',
				description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus in, dolore minus nobis quae, velit doloremque vitae molestiae similique repudiandae.',
				owner: '525cf20451979dea2c000001',
				members: [{
					memberId: '525cf20451979dea2c000001',
					memberPermission: 'admin'
				}],
				approvalRequests: [{
          user: user._id,
          pending: true,
          approved: false
        }],
				approvedUsers: [],
				mailingList: 'organizationname',
				// plants: [plant._id],
				contact: {
					phone: 1234567890,
					email: 'org.mail.com',
					website: 'http://www.org.com',
					address: {
						street: '190 faker street',
						city: 'Fake City',
						state: 'New York',
						zip: 11111
					}
				},
				orders: ['525cf20451979dea2c000001']
			};

			sampleOrganizationResponse = {
				_id: '525cf20451979dea2c000345',
				type: 'vendor',
				name: 'Organization Name',
				description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus in, dolore minus nobis quae, velit doloremque vitae molestiae similique repudiandae.',
				owner: '525cf20451979dea2c000001',
				members: [{
					memberId: '525cf20451979dea2c000001',
					memberPermission: 'admin'
				}],
				mailingList: 'organizationname',
				// plants: [plant._id],
				contact: {
					phone: 1234567890,
					email: 'org.mail.com',
					website: 'http://www.org.com',
					address: {
						street: '190 faker street',
						city: 'Fake City',
						state: 'New York',
						zip: 11111
					}
				},
				orders: ['525cf20451979dea2c000001']
			};
		});

		it('Should approve requesting user', inject(function() {			
			Followers.approve(user, sampleOrganization, function (res) {
        var message = res.message;
        var approvalRequests = res.organization.approvalRequests.length;
        console.log(approvalRequests);
      })
		}));
	});
}());