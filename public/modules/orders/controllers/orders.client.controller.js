'use strict';

// Orders controller
angular.module('orders').controller('OrdersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Orders', 'Organizations',
	function($scope, $stateParams, $location, Authentication, Orders, Organizations) {

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

	}
]);