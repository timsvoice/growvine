'use strict';

(function() {
	// Orders Controller Spec
	describe('Orders Controller Tests', function() {
		// Initialize global variables
		var OrdersController,
		scope,
		$httpBackend,
		$stateParams,
		$location,
		sampleOrganization,
		sampleOrganizationResponse,
		sampleOrderResponse,
		plant;





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

			// Initialize the Orders controller.
			OrdersController = $controller('OrdersController', {
				$scope: scope
			});
		}));

		beforeEach(function(){
			// set user
			scope.authentication.user = {
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
			// Create a sample Order object
			scope.order = {
				shipTo: {
					firstName: 'Jim',
					lastName: 'Bob',					
					street: '190 faker street',
					city: 'Fake City',
					state: 'New York',
					zip: 11111					
				},
				vendor: '525cf20451979dea2c000345',
				memo: 'lorem20',
				confirmed: false,
				invoiced: false,
				createdOrganization: '525cf20451979dea2c000001',
				createdUser: '525cf20451979dea2c000001',
			};

			// scope.plants = ['525cf20451979dea2c000001'];

			// Create new Order object
			plant = {
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
			};

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

			// Create a sample Order response
			sampleOrderResponse = {
				_id: '525cf20451979dea2c000001',
				orderNumber: 2,
				shipTo: {
					firstName: 'Jim',
					lastName: 'Bob',					
					street: '190 faker street',
					city: 'Fake City',
					state: 'New York',
					zip: 11111					
				},
				vendor: '525cf20451979dea2c000345',
				memo: 'lorem20',
				submitted: true,
				confirmed: false,
				invoiced: false,
				createdOrganization: '525cf20451979dea2c000001',
				createdUser: '525cf20451979dea2c000001',
				plants: ['525cf20451979dea2c000001'],
			};
		});

		it('$scope.find() should create an array with at least one Order object fetched from XHR', inject(function(Orders) {
			// Create sample Order using the Orders service
			var sampleOrder = new Orders({
				name: 'New Order'
			});

			// Create a sample Orders array that includes the new Order
			var sampleOrders = [sampleOrder];

			// Set GET response
			$httpBackend.expectGET('orders').respond(sampleOrders);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.orders).toEqualData(sampleOrders);
		}));

		it('$scope.findOne() should create an array with one Order object fetched from XHR using a orderId URL parameter', inject(function(Orders) {
			// Define a sample Order object
			var sampleOrder = new Orders({
				name: 'New Order'
			});

			// Set the URL parameter
			$stateParams.orderId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/orders\/([0-9a-fA-F]{24})$/).respond(sampleOrder);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.order).toEqualData(sampleOrder);
		}));

		it('$scope.create(submit) with valid data should submit the order, update organization orders, and then locate to user organization URL', inject(function(Orders) {

			// get last order
			$httpBackend.expectGET('orders').respond(sampleOrderResponse);
			// post new order
			$httpBackend.expectPOST('orders').respond(sampleOrderResponse);
			// get order vendor
			$httpBackend.expectGET('organizations/' + scope.order.vendor).respond(sampleOrganization);
			// update vendors order
			$httpBackend.expectPOST('organizations/' + scope.order.vendor).respond(sampleOrganizationResponse);

			scope.create('submit');
			// Run controller functionality
			$httpBackend.flush();
			// $scope.message should show submitted order message
			expect(scope.message).toBe('Your order has been submitted. You can check the status in "My Orders"');
			// Test URL redirection after the Order was created
			expect($location.path()).toBe('/organizations/' + scope.authentication.user.organization);
		}));

		it('$scope.create(save) should save order but not submit to vendor, and then locate to user organization URL', inject(function(Orders) {
			// set order response to false
			sampleOrderResponse.submitted = false;
			// get last order
			$httpBackend.expectGET('orders').respond(sampleOrderResponse);
			// post new order
			$httpBackend.expectPOST('orders').respond(sampleOrderResponse);

			scope.create('save');
			// Run controller functionality
			$httpBackend.flush();
			// $scope.message should show submitted order message
			expect(scope.message).toBe('Your order has been saved.');
			// Test URL redirection after the Order was created
			expect($location.path()).toBe('/organizations/' + scope.authentication.user.organization);
		}));

		it('$scope.update() should update a valid Order', inject(function(Orders) {
			// Define a sample Order put data
			var sampleOrderPutData = new Orders({
				_id: '525cf20451979dea2c000001',
				name: 'New Order'
			});

			// Mock Order in scope
			scope.order = sampleOrderPutData;

			// Set PUT response
			$httpBackend.expectPUT(/orders\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/organizations/' + scope.authentication.user.organization);
		}));

		it('$scope.remove() should send a DELETE request with a valid orderId and remove the Order from the scope', inject(function(Orders) {		
			// Create new Order object
			var sampleOrder = new Orders({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Orders array and include the Order
			scope.orders = [sampleOrder];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/orders\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleOrder);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.orders.length).toBe(0);
		}));
		it('$scope.addToOrder() should add plant to $scope.plants array', inject(function(Plants) {
			// Run controller functionality
			scope.addToOrder(plant);
			// Test array after successful delete
			expect(scope.plants.length).toBe(1);
		}));
	});
}());