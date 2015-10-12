'use strict';

angular.module('organizations').directive('ordersTable', [
	function() {
		return {
			templateUrl: './modules/organizations/views/orders.table.directive.client.view.html',
			restrict: 'E',
      transclude: true
		};
	}
]);