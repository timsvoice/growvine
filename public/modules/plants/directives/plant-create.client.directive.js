'use strict';

angular.module('plants').directive('plantCreate', [
	function() {
		return {
			templateUrl: './modules/plants/views/plant.create.directive.client.view.html',
			restrict: 'E'
		};
	}
]);