'use strict';

// Orders controller
angular.module('orders').controller('OrdersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Orders', 'Organizations',
	function($scope, $stateParams, $location, Authentication, Orders, Organizations) {
		
		$scope.authentication = Authentication;
		
		// set empty array
		$scope.plants = [];

		$scope.addToOrder = function(plant) {			
			$scope.plants.push(plant._id);		
		}

		// Create new Order
		$scope.create = function(status) {			
			// Create new Order object
			var order = new Orders ($scope.order);						
			// set status
			if (status === 'submit') {
				order.submitted = true
			} else if (status === 'save') {
				order.submitted = false
			};
			// set order.plants to plants
			order.plants = $scope.plants;
			// show message if order is empty
			if ($scope.plants.length < 1) {
				$scope.plantsMessage = 'Add plants to your order'
			}
			// get last order.number to set this order number
			Orders.get(function(lastOrder){
				// if no order exists, set to 1
				if (lastOrder.length < 1) {
					order.orderNumber = 1;
				} else{
					order.orderNumber = lastOrder.orderNumber + 1;
				};													
				order.$save(function(response) {
					// test if order is saved or submitted
					if (response.submitted === true) {					
						// add to orgs orders if submitted
						Organizations.get({
							organizationId: order.vendor
						}, function(organization){							
							organization.orders.push(order._id)
							organization.$save();
							// flash message
							$scope.message = 'Your order has been submitted. You can check the status in "My Orders"';
						})
					} else {
						// flash message
						$scope.message = 'Your order has been saved.';
					};
					$location.path('/organizations/' + $scope.authentication.user.organization);
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			});
		};

		// Remove existing Order
		$scope.remove = function(order) {
			if ( order ) { 
				order.$remove();

				for (var i in $scope.orders) {
					if ($scope.orders [i] === order) {
						$scope.orders.splice(i, 1);
					}
				}

				Organizations.get({
					organizationId: order.vendor
				}, function(org){
						for (var i = org.orders.length - 1; i >= 0; i--) {
							if (org.orders[i] === order._id) {
								org.orders.splice(i, 1);
							}
						}
					})

					$location.path('/organizations' + $scope.authentication.user.organization);
					$scope.message = 'order successfully deleted'
			} else {
				$scope.order.$remove(function() {
					$location.path('/organizations' + $scope.authentication.user.organization);
					$scope.message = 'order successfully deleted'
				});
			}
		};

		// Update existing Order
		$scope.update = function() {
			var order = $scope.order;

			order.$update(function() {
				$location.path('/organizations/' + $scope.authentication.user.organization);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Orders
		$scope.find = function() {
			$scope.orders = Orders.query();
		};

		// Find existing Order
		$scope.findOne = function() {
			$scope.order = Orders.get({ 
				orderId: $stateParams.orderId
			});
		};
	}
]);