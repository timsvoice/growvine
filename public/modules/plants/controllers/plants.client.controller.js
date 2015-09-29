'use strict';

// Plants controller
angular.module('plants').controller('PlantsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Plants', 'PlantQuery', 'Organizations','FormlyForms', 'FoundationApi', 'Uploader',
	function($scope, $stateParams, $location, Authentication, Plants, PlantQuery, Organizations, FormlyForms, FoundationApi, Uploader) {
		$scope.authentication = Authentication;
    
    // set organization plants
    // PlantQuery.findPlants($stateParams.organizationId, function (plants){
    //   $scope.plants = plants;    
    // });

    // register plant model
    $scope.plantObj = {
      image: '',
      organization: '',
      commonName: '',
      scientificName: '',
      unitSize: '',
      unitPrice: 0,
      unitRoyalty: 0,
      unitAvailability: []
    };
    
    $scope.newAvailability = {
        date: new Date(),
        quantity: '',
    };

    $scope.formCreatePlant = FormlyForms.createPlant($scope.plantObj);    
    $scope.formUpdatePlant = FormlyForms.updatePlant($scope.plant);

		// Create new Plant
		$scope.createPlant = function () {
			var user = $scope.authentication.user,
          plant;

      $scope.plantObj.organization = user.organization;
      plant = new Plants ($scope.plantObj);

      console.log(user.organization);
      plant.$save(function (plant) {        
        $scope.plants.push(plant);
        // close modal
        FoundationApi.closeActiveElements();      
        $scope.plantObj = {};
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
		};

    // Find a list of Plants
    $scope.findPlants = function() {      
      $scope.plants = Plants.query();
    };

    // Find existing Plant
    $scope.findPlant = function() {
      $scope.plant = Plants.get({ 
        plantId: $stateParams.plantId
      });
    };

    $scope.updatePlant = function (plant, index) {          
      Plants.update({
        plantId: plant._id
      }, plant, function (plant) {
        $scope.plants[index] = plant;
        $scope.plant = {};
        // close modal
        FoundationApi.closeActiveElements(); 
        $scope.message = plant.commonName + ', successfully updated'          
      });
    };

    $scope.removePlant = function(plant, index) {      
      $scope.plants.splice(index, 1);
      Plants.delete({
        plantId: plant._id
      }, plant, function(){        
        // remove object from $scope data
        $scope.message = plant.commonName + ', successfully deleted'
      })
    }

    // Availability Functions
    $scope.addPlantAvailability = function (plant) {
      var availability = {
            date: $scope.newAvailability.date,
            quantity: $scope.newAvailability.quantity
          };
      // add availability
      plant.unitAvailability.push(availability);   
      $scope.newAvailability = {
        date: new Date()
      };   
    }

    $scope.removePlantAvailability = function (plant, index) {      
      plant.unitAvailability.splice(index, 1);
    }

    // Plant Assets
    $scope.uploadPlantImage = function (file, plant) {
      var organization = $scope.organization,
          name = plant.commonName,
          plant = plant,
          request = {
            file: file,
            id: organization._id,
            name: name,
            organizationName: organization.name
          };

      Uploader.uploadImage(request)
        .then(function (response) {
          $scope.message = response.message;     
          plant.image = response.url;   

          Plants.update({
            plantId: plant._id
          }, plant, function () {
            $scope.message = plant.commonName + ', successfully updated'          
          });         
      });      
    }

	}
]);