'use strict';

angular.module('organizations').directive('availabilityManager', [
	function() {
		return {
			templateUrl: './modules/organizations/views/availability.manager.directive.client.view.html',
			restrict: 'E'
		};
	}
]);