'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Organizations', 'Users',
	function($scope, Authentication, Users, Organizations) {
		$scope.authentication = Authentication;
		$scope.user = Authentication.user;
		
		$scope.isCollapsed = false;

		if ($scope.user.organization) {
			$scope.hasOrg = true;
		} else {
			$scope.hasOrg = false;
		}

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);