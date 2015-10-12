'use strict';

// Orders controller
angular.module('orders').controller('OrdersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Orders', 'Organizations',
	function($scope, $stateParams, $location, Authentication, Orders, Organizations) {

	var ordersVm = this;

	var init = function init () {
		Orders.service.findOrgOrders($stateParams.organizationId, function (orders) {
			ordersVm.orders = orders;
		})
	}

	init();
	
	ordersVm.confirmOrder = function confirmOrder (order) {
		Orders.service.confirmOrder(order, function (response) {
			console.log(response.message);
		})
	}

		

	}
]);