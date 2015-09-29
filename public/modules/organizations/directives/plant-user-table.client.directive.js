'use strict';

angular.module('organizations').directive('plantUserTable', [
	function() {
		return {
			templateUrl: './modules/organizations/views/plant.user.table.directive.client.view.html',
			restrict: 'E'
		};
	}
]);