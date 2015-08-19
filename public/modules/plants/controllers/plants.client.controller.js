'use strict';

// Plants controller
angular.module('plants').controller('PlantsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Plants', 'Organizations','FormlyForms',
	function($scope, $stateParams, $location, Authentication, Plants, Organizations, FormlyForms) {
		$scope.authentication = Authentication;
		$scope.organization = Organizations.get({
			organizationId: $scope.authentication.user.organization_id
		})
		console.log($scope.authentication.user);
    // register plant model
    $scope.plantObj = {
      organization: '',
      commonName: '',
      scientificName: '',
      unitSize: '',
      unitPrice: 0,
      unitRoyalty: 0,
      unitAvailability: [{
        date: new Date(),
        quantity: '100',
      }]
    };

    $scope.formCreatePlant = FormlyForms.createPlant($scope.plantObj);

		// Create new Plant
		$scope.create = function() {
			// register user on scope
			$scope.user = $scope.authentication.user;
			// set plant organization to creating user org
			$scope.plantObj.organization = user.organization_id;
			// Create new Plant object
			var plant = new Plants ($scope.plantObj);
			// Redirect after save
			plant.$save(function(response) {
				$location.path('plants/' + response._id);
				// Clear form fields
				$scope.plantObj = {};
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Plant
		$scope.remove = function(plant) {
			if ( plant ) { 
				plant.$remove();

				for (var i in $scope.plants) {
					if ($scope.plants [i] === plant) {
						$scope.plants.splice(i, 1);
					}
				}
			} else {
				$scope.plant.$remove(function() {
					$location.path('plants');
				});
			}
		};

		// Update existing Plant
		$scope.update = function() {
			var plant = $scope.plant;

			plant.$update(function() {
				$location.path('plants/' + plant._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Plants
		$scope.find = function() {
			$scope.plants = Plants.query();
		};

		// Find existing Plant
		$scope.findOne = function() {
			$scope.plant = Plants.get({ 
				plantId: $stateParams.plantId
			});
		};
	}
]);