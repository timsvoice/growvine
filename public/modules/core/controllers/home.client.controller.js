'use strict';


angular.module('core').controller('HomeController', ['$scope', '$location', 'Authentication',
	function($scope, $location, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
    // take user to their organization or to create and org
    if (Authentication.user && Authentication.user.organization) {
      console.log(Authentication.user.organization);
      $location.path('/organizations/' + Authentication.user.organization);
    } else if (Authentication.user && !Authentication.user.organization) {
      console.log(Authentication.user);
      $location.path('/organizations/create');
    } else {
      console.log('none');
      $location.path('/');
    };
	}
]);