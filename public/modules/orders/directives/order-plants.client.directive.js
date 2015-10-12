'use strict';

angular.module('organizations').directive('orderPlants', [
	function() {
		return {
			templateUrl: './modules/organizations/views/order.plants.directive.client.view.html',
			restrict: 'E',
      transclude: true
		};
	}
])
