'use strict';

(function() {
	// OrganizationGrid Controller Spec
	describe('OrganizationGrid Controller Tests', function() {
		// Initialize global variables
		var OrganizationGridController,
			scope,
			$httpBackend,
			$stateParams,
			$location;

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
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the OrganizationGrid controller.
			OrganizationGridController = $controller('OrganizationGridController', {
				$scope: scope
			});
		}));

		it('Should do set $scope.plantsGrid.data to organization plants and set user permissions', inject(function(Plants, Organizations) {
			
			// Create sample Organization using the Organizations service
			var plant = new Plants({
				_id: '525cf20451979dea2c000002',
				organization: '525a8422f6d0f87f0e407a33',
				commonName: 'Common Name',
				scientificName: 'Scientific Name',
				unitSize: '2ft',
				unitPrice: 1,
				unitRoyalty: 1,
				unitAvailability: [{
					date: new Date(),
					quantity: 100
				}]
			});

			var sampleOrganizationResponse = new Organizations({
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
				plants: [plant._id],
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
				}
			});

			scope.user = {
				_id: '525cf20451979dea2c000001',
				firstName: 'Fred',
				lastName: 'User',
				email: 'fred@mail.com',
				password: 'password',
				isAdmin: false,
				isOwner: true,
				organization_id: sampleOrganizationResponse._id,
				provider: 'local'			
			}

			// Set the URL parameter
			$stateParams.organizationId = sampleOrganizationResponse._id;			
			// Set GET response for plants
			$httpBackend.expectGET(/organizations\/([0-9a-fA-F]{24})$/).respond(sampleOrganizationResponse);
			// set get response for user permissions
			$httpBackend.expectGET(/organizations\/([0-9a-fA-F]{24})$/).respond(sampleOrganizationResponse);

			// scope.findPlants();
			$httpBackend.flush();

			// Test scope value
			expect(scope.plantsGrid.data).toEqualData(sampleOrganizationResponse.plants);
			expect(scope.userPermission).toEqual('owner');
		}));
	
	it('Should do update plant when $scope.update() is called', inject(function(Plants, Organizations) {
		
		// Create sample Organization using the Organizations service
		var plant = new Plants({
			_id: '525cf20451979dea2c000002',
			organization: '525a8422f6d0f87f0e407a33',
			commonName: 'Common Name',
			scientificName: 'Scientific Name',
			unitSize: '2ft',
			unitPrice: 1,
			unitRoyalty: 1,
			unitAvailability: [{
				date: new Date(),
				quantity: 100
			}]
		});

		var sampleOrganizationResponse = new Organizations({
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
			plants: [plant._id],
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
			}
		});

		scope.user = {
			_id: '525cf20451979dea2c000001',
			firstName: 'Fred',
			lastName: 'User',
			email: 'fred@mail.com',
			password: 'password',
			isAdmin: false,
			isOwner: true,
			organization_id: sampleOrganizationResponse._id,
			provider: 'local'			
		}

		// Set the URL parameter
		$stateParams.organizationId = sampleOrganizationResponse._id;			
		// Set GET response for plants
		$httpBackend.expectGET(/organizations\/([0-9a-fA-F]{24})$/).respond(sampleOrganizationResponse);
		// set get response for user permissions
		$httpBackend.expectGET(/organizations\/([0-9a-fA-F]{24})$/).respond(plant);
		// mock PUT request
		$httpBackend.expectPUT(/plants\/([0-9a-fA-F]{24})$/).respond(plant);
		// call update function
		scope.update(plant);

		$httpBackend.flush();

		// Test scope value
		expect(scope.message).toEqual(plant.commonName + ', successfully updated');
	}));
});
}());