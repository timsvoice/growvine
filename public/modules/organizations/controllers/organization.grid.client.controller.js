'use strict';

angular.module('organizations').controller('OrganizationGridController', ['$scope', '$stateParams', 'Organizations', 'Authentication', 'Plants', 'Permissions', 'PlantQuery', 'FormlyForms',
	function($scope, $stateParams, Organizations, Authentication, Plants, Permissions, PlantQuery, FormlyForms) {
    
    $scope.authentication = Authentication;
    
    // set current user permissions
    Permissions.userPermissions($scope.authentication.user, $stateParams.organizationId, function(permission){
      $scope.userPermission = permission;
    });

    // set organization plants
    PlantQuery.findPlants($stateParams.organizationId, function(orgPlants){
      $scope.plantsGrid.data = orgPlants;
    });

    $scope.plantAvailability = {
      date: '',
      quantity: ''
    }

    $scope.formUpdateAvailability = FormlyForms.updateAvailability($scope.plantAvailability);

    // setup plants grid      
    $scope.plantsGrid = {       
      enableGridMenu: true,
      enableFiltering: true,
      showSelectionCheckbox: true,
      enableCellEditOnFocus: true, 
      enableRowSelection: true,
      enableSelectAll: false,
      columnDefs: [
        { name: 'commonName', 
          displayName: 'Common Name', 
          enableFiltering: true 
        },
        { name: 
          'scientificName', 
          displayName: 'Scientific Name', 
          visible: true 
        },
        { name: 
          'unitSize', 
          displayName: 'Size', 
          visible: true 
        },
        { name: 'unitPrice' , 
          displayName: 'Price', 
          visible: true, 
          enableFiltering: false 
        },
        { name: 
          'unitAvailability', 
          displayName: 'Availability', 
          visible: true, 
          enableFiltering: false,
          enableCellEdit: false, 
          cellTemplate: '<a class="button"  ng-click="grid.appScope.updateAvailability(row.entity)" zf-open="availabilityModal">Manage Availability</a>' 
        },
        { name: '_id', 
          visible: false 
        },
        { name: 'delete', 
          displayName: '', 
          enableColumnMenu: false, 
          enableSorting: false, 
          enableCellEdit: false, 
          cellTemplate: '<div class="button" ng-click="grid.appScope.remove(row.entity)">Delete</div>' 
        }
      ],
      // save records imported through grid importer
      importerDataAddCallback: function ( grid, newObjects ) {
        // save each new record to the db
        for (var i = newObjects.length - 1; i >= 0; i--) {
          Plants.find().$add(newObjects[i])
        };          
      },
      // save changes made in grid
      onRegisterApi: function(gridApi) {
        // when unfocused on edited cell, save
        $scope.gridApi = gridApi;
        gridApi.edit.on.afterCellEdit($scope,$scope.update);
      }
    };    

    $scope.updateAvailability = function(plant) {
      $scope.plantAvailability = plant.unitAvailability;
      console.log($scope.plantAvailability);
    }

    // Update existing Plant
    $scope.update = function(plant) {
      Plants.update({
        plantId: plant._id
      }, plant, function(){
          $scope.message = plant.commonName + ', successfully updated'
        }
      );
    };

    $scope.remove = function(plant) {
      Plants.delete({
        plantId: plant._id
      }, plant, function(){        
        // remove object from $scope data
        $scope.plantsGrid.data.splice(plant.$index, 1);
        $scope.message = plant.commonName + ', successfully deleted'
      })
    }
	}
]);