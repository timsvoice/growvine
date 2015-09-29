'use strict';

angular.module('plants').directive('plantUpdate', [
	function() {
		return {
			templateUrl: './modules/plants/views/plant.update.directive.client.view.html',
			restrict: 'E'
		};
	}
]);