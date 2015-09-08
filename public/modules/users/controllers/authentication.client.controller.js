'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', 'FormlyForms', 'FoundationApi',
	function($scope, $http, $location, Authentication, FormlyForms, FoundationApi) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.credentials = {
			email: '',
			password: ''
		}
		$scope.error = 'testing';
		// signup form from Formly Service
		$scope.formCreateUser = FormlyForms.createUser($scope.credentials);
		// signin form from Formly Service
		$scope.formSigninUser = FormlyForms.signinUser($scope.credentials);
		
		$scope.signup = function() {			
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;
				$scope.message = 'signed in'
				FoundationApi.closeActiveElements();
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {			
			console.log('clicked');
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;
				$scope.message = 'signed in'
				FoundationApi.closeActiveElements();
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);