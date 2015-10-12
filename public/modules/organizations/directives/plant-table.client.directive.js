'use strict';

angular.module('plants').directive('plantOwnerTable', [
	function() {
		return {
			templateUrl: './modules/organizations/views/plant.owner.table.directive.client.view.html',
			restrict: 'E',
      transclude: true
		};
	}
]);