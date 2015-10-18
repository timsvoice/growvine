'use strict';

(function() {
	// Followers Service Spec
	describe('Followers Service Tests', function() {
		// Initialize global variables
		var Followers,
				Organizations,
				scope,
				$httpBackend,
				$stateParams,
				$location,
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
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Followers_, _Organizations_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;
			Followers = _Followers_;
			Organizations = _Organizations_;

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

			sampleOrganization = new Organizations.resource({
				_id: '525cf20451979dea2c000345',
				type: 'vendor',
				name: 'Organization Name',
				description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus in, dolore minus nobis quae, velit doloremque vitae molestiae similique repudiandae.',
				owner: user,
				members: [{
					memberId: '525cf20451979dea2c000001',
					memberPermission: 'admin'
				}],
				mailingList: 'organizationname',
				// plants: [plant._id],
				approvalRequests: [],
				approvedUsers: [],
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
			});

			sampleOrganizationResponse = new Organizations.resource({
				_id: '525cf20451979dea2c000345',
				type: 'vendor',
				name: 'Organization Name',
				description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus in, dolore minus nobis quae, velit doloremque vitae molestiae similique repudiandae.',
				owner: user,
				members: [{
					memberId: '525cf20451979dea2c000001',
					memberPermission: 'admin'
				}],
				mailingList: 'organizationname',
				// plants: [plant._id],
				approvalRequests: [{
					user: user._id,
					pending: true,
					approved: false
				}],
				approvedUsers: [],				
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
			});

		});

		it('Should register follow request with owner', inject(function() {
			$httpBackend.whenPUT('organizations/525cf20451979dea2c000345').respond(200);
			$httpBackend.whenPOST('/mailer/send').respond(200);
			Followers.request(user, sampleOrganization, function (res) {
				expect(res.organization.approvalRequests.length).toBe(1);
			})
			$httpBackend.flush();
		}));
		it('Should approve a follow request', function() {
			$httpBackend.whenPUT('organizations/525cf20451979dea2c000345').respond(200);
			Followers.approve(user._id, sampleOrganizationResponse, function (res) {
				expect(res.organization.approvedUsers.length).toBe(1);
			})
			$httpBackend.flush();
		});
		it('Should deny a follow request', function() {
			$httpBackend.whenPUT('organizations/525cf20451979dea2c000345').respond(200);
			Followers.deny(user._id, sampleOrganizationResponse, function (res) {
				expect(res.organization.approvedUsers.length && res.organization.approvalRequests.length).toBe(0);
			})
			$httpBackend.flush();
		});		
	});
}());