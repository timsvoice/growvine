// 'use strict';

// (function() {
// 	// Organizations Controller Spec
// 	describe('Organizations Controller Tests', function() {
// 		// Initialize global variables
// 		var OrganizationsController,
// 		scope,
// 		$httpBackend,
// 		$stateParams,
// 		$location;

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

// 			// Initialize the Organizations controller.
// 			OrganizationsController = $controller('OrganizationsController', {
// 				$scope: scope				
// 			});			

// 		}));
			

// 		it('$scope.find() should create an array with at least one Organization object fetched from XHR', inject(function(Organizations) {
// 			scope.authentication = {
// 				user: {
// 					_id: '525cf20451979dea2c000001',
// 					firstName: 'Fred',
// 					lastName: 'User',
// 					email: 'fred@mail.com',
// 					password: 'password',
// 					isAdmin: false,
// 					isOwner: true,
// 					// organization_id: organization._id,
// 					provider: 'local'			
// 				}
// 			}

// 			// Create new Organization object
// 			var sampleOrganization = new Organizations({
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
// 			});
// 			// Create a sample Organizations array that includes the new Organization
// 			var sampleOrganizations = [sampleOrganization];


// 			$stateParams.organizationId = sampleOrganization._id;

// 			// Get permissions and plants
// 			// $httpBackend.expectGET('organizations').respond(sampleOrganization);
// 			$httpBackend.expectGET('organizations').respond(sampleOrganization);

// 			// Set GET response
// 			$httpBackend.expectGET('organizations').respond(sampleOrganizations);

// 			// Run controller functionality
// 			scope.findOrganizations();

// 			$httpBackend.flush();

// 			// Test scope value
// 			expect(scope.organizations).toEqualData(sampleOrganizations);
// 		}));

// 		it('$scope.findOne() should create an array with one Organization object fetched from XHR using a organizationId URL parameter', inject(function(Organizations) {
// 			scope.authentication = {
// 				user: {
// 					_id: '525cf20451979dea2c000001',
// 					firstName: 'Fred',
// 					lastName: 'User',
// 					email: 'fred@mail.com',
// 					password: 'password',
// 					isAdmin: false,
// 					isOwner: true,
// 					// organization_id: organization._id,
// 					provider: 'local'			
// 				}
// 			}

// 			// Create new Organization object
// 			var sampleOrganization = new Organizations({
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
// 			});

// 			$stateParams.organizationId = sampleOrganization._id;

// 			//getting org plants
// 			$httpBackend.expectGET(/organizations\/([0-9a-fA-F]{24})$/).respond(sampleOrganization);

// 			// Set expected GET response
// 			$httpBackend.expectGET(/organizations\/([0-9a-fA-F]{24})$/).respond(sampleOrganization);

// 			// Run controller functionality
// 			scope.findOrganization();
// 			$httpBackend.flush();
// 			// Test scope value
// 			expect(scope.organization).toEqualData(sampleOrganization);
// 		}));

// 		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Organizations) {
// 			// set user object
// 			scope.authentication.user = {
// 				_id: '525cf20451979dea2c000001',
// 				firstName: 'Fred',
// 				lastName: 'User',
// 				email: 'fred@mail.com',
// 				password: 'password',
// 				isAdmin: false,
// 				isOwner: true,
// 				// organization_id: organization._id,
// 				provider: 'local'			
// 			}


// 			// Create sample Organization using the Organizations service
// 			var sampleOrganizationResponse = new Organizations ({
// 				type: 'vendor',
// 				name: 'Organization Name',
// 				description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus in, dolore minus nobis quae, velit doloremque vitae molestiae similique repudiandae.',
// 				owner: '525cf20451979dea2c000001',
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
// 			});
			
// 			// Create sample Organization using the Organizations service
// 			scope.orgData = {
// 				type: 'vendor',
// 				name: 'Organization Name',
// 				description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus in, dolore minus nobis quae, velit doloremque vitae molestiae similique repudiandae.',
// 				owner: '',
// 				members: [],
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

// 			$stateParams.organizationId = sampleOrganizationResponse._id;

// 			// Get permissions and plants
// 			$httpBackend.expectGET(/organizations\/([0-9a-fA-F]{24})$/).respond(sampleOrganizationResponse);

// 			// Set POST response
// 			$httpBackend.expectPOST('organizations').respond(200, sampleOrganizationResponse);
			
// 			// Run controller functionality
// 			scope.createOrganization();
// 			$httpBackend.flush();

// 			// Test form inputs are reset
// 			expect(scope.name).toEqual('');
// 			// Test URL redirection after the Organization was created
// 			expect($location.path()).toBe('/organizations/' + sampleOrganizationResponse._id);
// 		}));

// 		it('$scope.update() should update a valid Organization', inject(function(Organizations) {
// 			// User
// 			scope.authentication = {
// 				user: {
// 					_id: '525cf20451979dea2c000001',
// 					firstName: 'Fred',
// 					lastName: 'User',
// 					email: 'fred@mail.com',
// 					password: 'password',
// 					isAdmin: false,
// 					isOwner: true,
// 					// organization_id: organization._id,
// 					provider: 'local'			
// 				}
// 			}
// 			// Define a sample Organization put data
// 			var sampleOrganizationPutData = new Organizations({
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
// 			});

// 			// Mock Organization in scope
// 			scope.organization = sampleOrganizationPutData;

// 			$stateParams.organizationId = sampleOrganizationPutData._id;
			
// 			// Get permissions and plants
// 			$httpBackend.expectGET('organizations').respond(sampleOrganizationPutData);
// 			// Set PUT response
// 			$httpBackend.expectPUT(/organizations\/([0-9a-fA-F]{24})$/).respond();

// 			// Run controller functionality
// 			scope.updateOrganization();
// 			$httpBackend.flush();

// 			// Test URL location to new object
// 			expect($location.path()).toBe('/organizations/' + sampleOrganizationPutData._id);
// 		}));

// 		it('$scope.remove() should send a DELETE request with a valid organizationId and remove the Organization from the scope', inject(function(Organizations) {
			
// 			scope.authentication = {
// 				user: {
// 					_id: '525cf20451979dea2c000001',
// 					firstName: 'Fred',
// 					lastName: 'User',
// 					email: 'fred@mail.com',
// 					password: 'password',
// 					isAdmin: false,
// 					isOwner: true,
// 					// organization_id: organization._id,
// 					provider: 'local'			
// 				}
// 			}

// 			// Create new Organization object
// 			var sampleOrganization = new Organizations({
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
// 			});

// 			$stateParams.organizationId = sampleOrganization._id;


// 			// Create new Organizations array and include the Organization
// 			scope.organizations = [sampleOrganization];
// 			//getting org plants
// 			$httpBackend.expectGET(/organizations\/([0-9a-fA-F]{24})$/).respond(sampleOrganization);

// 			// Set expected DELETE response
// 			$httpBackend.expectDELETE(/organizations\/([0-9a-fA-F]{24})$/).respond(204);

// 			// Run controller functionality
// 			scope.removeOrganization(sampleOrganization);
// 			$httpBackend.flush();

// 			// Test array after successful delete
// 			expect(scope.organizations.length).toBe(0);
// 		}));

// 	});
// }());