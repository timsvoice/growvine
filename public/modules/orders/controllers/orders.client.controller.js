'use strict';

// Orders controller
angular.module('orders').controller('OrdersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Orders', 'Organizations',
	function($scope, $stateParams, $location, Authentication, Orders, Organizations) {
		var orderNumber;

		orderNumber = function (order) {
			var lastOrder,
					orderNumber;

			// get last order.number to set this order number
			Orders.get(function(orders){
				
				lastOrder = orders.length;

				if (lastOrder != 0) {
					order.orderNumber = lastOrder + 1; 
				} else {
					order.orderNumber = 1
				};
										
				return orderNumber
			});
		};	

		$scope.authentication = Authentication;
		
		// // set empty array
		$scope.order = {
			plants: []
		};

		$scope.addPlantOrder = function (plant, quantity) {			
			$scope.order.plants.push({
				plant: plant, 
				quantity: quantity
			});
		}

		$scope.removePlantOrder = function (index) {
			$scope.order.plants.splice(index, 1);
		}

		$scope.updatePlantOrder = function (index, plant, quantity) {
			$scope.order.plants[index] = {
				plant: plant,
				quantity: quantity
			};
		}		

		$scope.savePlantOrder = function (order) {
			// Create new Order object
			var order = new Orders(order);
			order.orderNumber = orderNumber(order);
			// set status
			order.submitted = false		

			order.$save(function(response) {
				$scope.message = "Order# " + response.orderNumber + " has been saved."
			});	
		}

		// Create new Order
		$scope.submitPlantOrder = function(order) {			
			// Create new Order object
			var order = new Orders (order);						
			order.orderNumber = orderNumber(order);			
			// set status
			order.submitted = true
												
			order.$save(function(response) {
				Organizations.get({
					organizationId: order.vendor
				}, function (organization) {							
					organization.orders.push(order._id)
					organization.$save();
					// flash message
					$scope.message = 'Your order has been submitted. You can check the status in "My Orders"';
				})
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

		};

		// Remove existing Order
		$scope.removeOrder = function(order) {
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
		$scope.updateOrder = function() {
			var order = $scope.order;

			order.$update(function() {
				$location.path('/organizations/' + $scope.authentication.user.organization);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Orders
		$scope.findOrders = function() {
			$scope.orders = Orders.query();
		};

		// Find existing Order
		$scope.findOrder = function() {
			$scope.order = Orders.get({ 
				orderId: $stateParams.orderId
			});
		};
	}
]);