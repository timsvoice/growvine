'use strict';

// Plants controller
angular.module('plants').controller('PlantsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Plants', 'Organizations','FormlyForms', 'FoundationApi', 'Uploader', 'Helper', 'Orders',
	function($scope, $stateParams, $location, Authentication, Plants, Organizations, FormlyForms, FoundationApi, Uploader, Helper, Orders) {

    var plantsVm = this;

    ////
    //  Initial Setup
    ////

    var init = function init () {
      Plants.findOrgPlants($stateParams.organizationId, function (plants) {
        plantsVm.plants = plants;
      }); 
    }

    init();

    ////
    //  Messaging
    ////

    $scope.$on('plants.update', function (event, args) {
      Plants.findOrgPlants($stateParams.organizationId, function (plants) {
        plantsVm.plants = plants;
        $scope.message = args.message;
        FoundationApi.publish('success-notifications',            
          { 
            title: 'Success', 
            content: $scope.message ,
            autoclose: 2500,
          }
        );
      }); 
    })

    $scope.$on('plants.error', function (event, args) {
      $scope.message = args.message;
      FoundationApi.publish('error-notifications',            
        { 
          title: 'Error', 
          content: plants.message,
          autoclose: 2500
        }
      );
    })
    
    ////
    //  Form Setup 
    ////

    // register plant model
    plantsVm.plantObj = {
      image: '',
      organization: '',
      commonName: '',
      scientificName: '',
      unitSize: '',
      unitPrice: 0,
      unitRoyalty: 0,
      unitAvailability: []
    };
    // register availability model
    plantsVm.newAvailability = {
      date: new Date(),
      quantity: '',
    };

    // set empty array
    plantsVm.order = {
      plants: []
    };

    plantsVm.formCreatePlant = FormlyForms.createPlant(plantsVm.plantObj);    
    plantsVm.formUpdatePlant = FormlyForms.updatePlant(plantsVm.plant);
    plantsVm.formUpdateAvailability = FormlyForms.updateAvailability(plantsVm.newAvailability);

    ////
    //  Plant Functions 
    ////
  
    plantsVm.createPlant = function createPlant (plant) {
      Plants.createPlant($stateParams.organizationId, plant, function (response) {
        if (response.error != null) {
          plants.message = response.error;
        }
        FoundationApi.closeActiveElements('create-plant-modal');
      })
    }    

    plantsVm.updatePlant = function updatePlant (plant) {
      Plants.updatePlant(plant, function (response) {
        if (response.error != null) {
          plants.message = response.error;
        }      
      })
    }

    plantsVm.removePlant = function removePlant (plant) {
      Plants.removePlant(plant, function (response) {
        if (response.error != null) {
          plants.message = response.error;
        }      
      })
    }

    ////
    //  Availability Functions 
    ////

    plantsVm.updateAvailability = function updateAvailability (plant, availability) {
      Plants.addAvailability(plant, availability, function (response) {
        if (response.error != null) {
          $scope.message = response.error;
        }        
        plantsVm.newAvailability = {date: new Date()};
      })
    }

    plantsVm.removeAvailability = function removeAvailability (plant, index) {
      Plants.removeAvailability(plant, index, function (response) {    
        if (response.error != null) {
          $scope.message = response.error;
        }          
      })
    }

    ////
    //  Assets Functions 
    ////

    plantsVm.uploadPlantImage = function uploadPlantImage (file, plant) {
      Organizations.get({
        organizationId: $stateParams.organizationId
      }, function (organization) {
        Plants.uploadPlantImage(file, plant, organization, function (response) {
        })
      }, function (error) {
        $scope.message = "Unable to get Organization. Please try again later";
      })      
    }

	}
]);