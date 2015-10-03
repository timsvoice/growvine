// 'use strict';

// (function() {
// 	// Plants Controller Spec
// 	describe('Plants Controller Tests', function() {
// 		// Initialize global variables
// 		var PlantsController,
// 		scope,
// 		$httpBackend,
// 		$stateParams,
// 		$location,
// 		PlantsQuery;

// 		// The $resource service augments the response object with methods for updating and deleting the resource.
// 		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
// 		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
// 		// When the toEqualData matcher compares two objects, it takes only object properties into
// 		// account and ignores methods.
// 		beforeEach(function() {
// 			jasmine.addMatchers({
// 				toEqualData: function(util, customEqualityTesters) {
// 					return {
// 						compare: function(actual, expected) {
// 							return {
// 								pass: angular.equals(actual, expected)
// 							};
// 						}
// 					};
// 				}
// 			});
// 		});

// 		// Then we can start by loading the main application module
// 		beforeEach(module(ApplicationConfiguration.applicationModuleName));

// 		beforeEach(module(function($provide) {
// 			PlantsQuery = jasmine.createSpy("PlantsQuery", ["findPlants"]);
// 			PlantsQuery.findPlants.and.returnValue([{
// 	      _id: '525cf20451979dea2c000001',
// 	      scientificName: 'Scientific Name',
// 	      unitSize: '2ft',
// 	      unitPrice: 10,
// 	      unitRoyalty: 1,
// 	      availability: [{
// 	        date: new Date(),
// 	        quantity: '100',
// 	      }],
// 	      totalAvailable: 0
// 	    }]);

// 			$provide.value("PlantsQuery", PlantsQuery);

// 		}));

// 		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
// 		// This allows us to inject a service but then attach it to a variable
// 		// with the same name as the service.
// 		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
// 			// Set a new global scope
// 			scope = $rootScope.$new();

// 			// Point global variables to injected services
// 			$stateParams = _$stateParams_;
// 			$httpBackend = _$httpBackend_;
// 			$location = _$location_;

// 			// Initialize the Plants controller.
// 			PlantsController = $controller('PlantsController', {
// 				$scope: scope
// 			});
// 		}));

// 		it('$scope.find() should create an array with at least one Plant object fetched from XHR', inject(function(Plants, PlantsQuery) {
// 			// Create new Organization object
// 			var sampleOrganization = {
// 				_id: '525cf20451979dea2c000001',
// 				type: 'vendor',
// 				name: 'Organization Name',
// 				description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus in, dolore minus nobis quae, velit doloremque vitae molestiae similique repudiandae.',
// 				// owner: '525cf20451979dea2c000001',
// 				members: [{
// 					memberId: '525cf20451979dea2c000001',
// 					memberPermission: 'admin'
// 				}],
// 				mailingList: 'organizationname',
// 				contact: {
// 					phone: 1234567890,
// 					email: 'org.mail.com',
// 					website: 'http://www.org.com',
// 					address: {
// 						street: '190 faker street',
// 						city: 'Fake City',
// 						state: 'New York',
// 						zip: 11111
// 					}
// 				}
// 			};
// 			// Create sample Plant using the Plants service
// 			var samplePlant = new Plants({
// 	      _id: '525cf20451979dea2c000001',
// 	      scientificName: 'Scientific Name',
// 	      unitSize: '2ft',
// 	      unitPrice: 10,
// 	      unitRoyalty: 1,
// 	      availability: [{
// 	        date: new Date(),
// 	        quantity: '100',
// 	      }],
// 	      totalAvailable: 0
// 	    });

// 			// Create a sample Plants array that includes the new Plant
// 			var samplePlants = [samplePlant];

// 			// get organization
// 			$httpBackend.expectGET(/organizations\/([0-9a-fA-F]{24})$/).respond(sampleOrganization);
// 			// scope.plants = samplePlants;
// 			// Set GET response
// 			$httpBackend.expectGET('plants').respond(samplePlants);
			
// 			// Run controller functionality
// 			scope.findPlants();
// 			$httpBackend.flush();
// 			// Test scope value
// 			// expect(scope.plants).toEqualData(samplePlants);
// 			expect(PlantsQuery.findPlants).toHaveBeenCalled();
// 		}));

// 		it('$scope.findOne() should create an array with one Plant object fetched from XHR using a plantId URL parameter', inject(function(Plants) {
// 			// Create new Organization object
// 			var sampleOrganization = {
// 				_id: '525cf20451979dea2c000001',
// 				type: 'vendor',
// 				name: 'Organization Name',
// 				description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus in, dolore minus nobis quae, velit doloremque vitae molestiae similique repudiandae.',
// 				// owner: '525cf20451979dea2c000001',
// 				members: [{
// 					memberId: '525cf20451979dea2c000001',
// 					memberPermission: 'admin'
// 				}],
// 				mailingList: 'organizationname',
// 				contact: {
// 					phone: 1234567890,
// 					email: 'org.mail.com',
// 					website: 'http://www.org.com',
// 					address: {
// 						street: '190 faker street',
// 						city: 'Fake City',
// 						state: 'New York',
// 						zip: 11111
// 					}
// 				}
// 			};
// 			// Define a sample Plant object
// 			var samplePlant = new Plants({
// 				name: 'New Plant'
// 			});

// 			// Set the URL parameter
// 			$stateParams.plantId = '525a8422f6d0f87f0e407a33';

// 			// get organization
// 			// $httpBackend.expectGET(/organizations\/([0-9a-fA-F]{24})$/).respond(sampleOrganization);

// 			// Set GET response
// 			$httpBackend.expectGET(/plants\/([0-9a-fA-F]{24})$/).respond(samplePlant);

// 			// Run controller functionality
// 			scope.findPlant();
// 			$httpBackend.flush();

// 			// Test scope value
// 			expect(scope.plant).toEqualData(samplePlant);
// 		}));

// 		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Plants) {
// 			// Create new Organization object
// 			var sampleOrganization = {
// 				_id: '525cf20451979dea2c000001',
// 				type: 'vendor',
// 				name: 'Organization Name',
// 				description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus in, dolore minus nobis quae, velit doloremque vitae molestiae similique repudiandae.',
// 				// owner: '525cf20451979dea2c000001',
// 				members: [{
// 					memberId: '525cf20451979dea2c000001',
// 					memberPermission: 'admin'
// 				}],
// 				mailingList: 'organizationname',
// 				contact: {
// 					phone: 1234567890,
// 					email: 'org.mail.com',
// 					website: 'http://www.org.com',
// 					address: {
// 						street: '190 faker street',
// 						city: 'Fake City',
// 						state: 'New York',
// 						zip: 11111
// 					}
// 				}
// 			};			
// 			scope.authentication.user = {
// 				_id: '525cf20451979dea2c000001',
// 				firstName: 'Fred',
// 				lastName: 'User',
// 				email: 'fred@mail.com',
// 				password: 'password',
// 				isAdmin: false,
// 				isOwner: true,
// 				// organization_id: organization._id,
// 				provider: 'local'	,
// 				organization: '525cf20451979dea2c000001'		
// 			}
			
// 			scope.plantObj = {
// 	      commonName: 'Common Name',
// 	      scientificName: 'Scientific Name',
// 	      unitSize: '2ft',
// 	      unitPrice: 10,
// 	      unitRoyalty: 1,
// 	      availability: [{
// 	        date: new Date(),
// 	        quantity: '100',
// 	      }],
// 	      totalAvailable: 0
// 	    };

// 			// Create a sample Plant response
// 			var samplePlantResponse = new Plants({
// 	      commonName: 'Common Name',
// 	      scientificName: 'Scientific Name',
// 	      unitSize: '2ft',
// 	      unitPrice: 10,
// 	      unitRoyalty: 1,
// 	      availability: [{
// 	        date: new Date(),
// 	        quantity: '100',
// 	      }],
// 	      totalAvailable: 0,
// 	      organization: '525cf20451979dea2c000001' 
// 			});

// 			// Fixture mock form input values
// 			// scope.name = 'New Flant';
// 			// get organization
// 			// $httpBackend.expectGET(/organizations\/([0-9a-fA-F]{24})$/).respond(sampleOrganization);
// 			// Set POST response
// 			$httpBackend.expectPOST('plants').respond(samplePlantResponse);
// 			// Run controller functionality
// 			scope.plants = [];
// 			scope.createPlant();
// 			$httpBackend.flush();

// 			// Test form inputs are reset
// 			expect(scope.plantObj).toEqual({});

// 			// Test URL redirection after the Plant was created
// 			expect(scope.plants.length).toBe(1);
// 		}));

// 		it('$scope.update() should update a valid Plant', inject(function(Plants) {
// 			// Create new Organization object
// 			var sampleOrganization = {
// 				_id: '525cf20451979dea2c000001',
// 				type: 'vendor',
// 				name: 'Organization Name',
// 				description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus in, dolore minus nobis quae, velit doloremque vitae molestiae similique repudiandae.',
// 				// owner: '525cf20451979dea2c000001',
// 				members: [{
// 					memberId: '525cf20451979dea2c000001',
// 					memberPermission: 'admin'
// 				}],
// 				mailingList: 'organizationname',
// 				contact: {
// 					phone: 1234567890,
// 					email: 'org.mail.com',
// 					website: 'http://www.org.com',
// 					address: {
// 						street: '190 faker street',
// 						city: 'Fake City',
// 						state: 'New York',
// 						zip: 11111
// 					}
// 				}
// 			};
			
// 			// Create new Plant object
// 			var samplePlant = new Plants({
// 				_id: '525cf20451979dea2c000001'
// 			});

// 			// Define a sample Plant put data
// 			var samplePlantPutData = new Plants({
// 				_id: '525cf20451979dea2c000001',
// 				name: 'New Plant'
// 			});

// 			// Mock Plant in scope
// 			scope.plants = [samplePlantPutData];

// 			// get organization
// 			// $httpBackend.expectGET(/organizations\/([0-9a-fA-F]{24})$/).respond(sampleOrganization);

// 			// Set PUT response
// 			$httpBackend.expectPUT(/plants\/([0-9a-fA-F]{24})$/).respond();

// 			// Run controller functionality
// 			scope.updatePlant(samplePlantPutData, 0);
// 			$httpBackend.flush();

// 			// Test URL location to new object
// 			expect(scope.plants[0].name).toBe(samplePlantPutData.name);
// 		}));

// 		it('$scope.remove() should send a DELETE request with a valid plantId and remove the Plant from the scope', inject(function(Plants) {
// 			// Create new Organization object
// 			var sampleOrganization = {
// 				_id: '525cf20451979dea2c000001',
// 				type: 'vendor',
// 				name: 'Organization Name',
// 				description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus in, dolore minus nobis quae, velit doloremque vitae molestiae similique repudiandae.',
// 				// owner: '525cf20451979dea2c000001',
// 				members: [{
// 					memberId: '525cf20451979dea2c000001',
// 					memberPermission: 'admin'
// 				}],
// 				mailingList: 'organizationname',
// 				contact: {
// 					phone: 1234567890,
// 					email: 'org.mail.com',
// 					website: 'http://www.org.com',
// 					address: {
// 						street: '190 faker street',
// 						city: 'Fake City',
// 						state: 'New York',
// 						zip: 11111
// 					}
// 				}
// 			};			
// 			// Create new Plant object
// 			var samplePlant = new Plants({
// 				_id: '525a8422f6d0f87f0e407a33'
// 			});

// 			// Create new Plants array and include the Plant
// 			scope.plants = [samplePlant];

// 			// get organization
// 			// $httpBackend.expectGET(/organizations\/([0-9a-fA-F]{24})$/).respond(sampleOrganization);

// 			// Set expected DELETE response
// 			$httpBackend.expectDELETE(/plants\/([0-9a-fA-F]{24})$/).respond(204);

// 			// Run controller functionality
// 			scope.removePlant(samplePlant);
// 			$httpBackend.flush();

// 			// Test array after successful delete
// 			expect(scope.plants.length).toBe(0);
// 		}));
// 	});
// }());