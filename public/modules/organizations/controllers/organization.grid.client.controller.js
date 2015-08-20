'use strict';

angular.module('organizations').controller('OrganizationGridController', ['$scope', '$stateParams', 'Organizations', 'Authentication', 'Plants',
	function($scope, $stateParams, Organizations, Authentication, Plants) {
    
    $scope.authentication = Authentication;
    $scope.user = $scope.authentication.user;

    // set user permissions based on membership
    var organization = Organizations.get({ 
      organizationId: $stateParams.organizationId        
    }, function(organization){
      var isMember = [];
      for (var i = organization.members.length - 1; i >= 0; i--) {
        if(organization.members[i].memberId === $scope.user._id) {
          isMember.push(organization.members[i]);
        }
      };
      if (isMember.length < 1) {
        $scope.userPermission = 'user';
      } else {
        $scope.userPermission = 'owner';
      }
    });

    // setup plants grid      
    $scope.plantsGrid = {       
      enableGridMenu: true,
      enableFiltering: true,
      showSelectionCheckbox: true,
      enableCellEditOnFocus: true, 
      enableRowSelection: true,
      enableSelectAll: false,
      columnDefs: [
        { name: 'commonName', displayName: 'Common Name', enableFiltering: true },
        { name: 'scientificName', displayName: 'Scientific Name', visible: true },
        { name: 'unitSize', displayName: 'Size', visible: true },
        { name: 'unitMeasure' , displayName: 'Units', visible: true, enableFiltering: false },
        { name: 'unitPrice' , displayName: 'Price', visible: true, enableFiltering: false },
        { name: '_id', visible: false },
        { name: 'delete', displayName: '', enableColumnMenu: false, enableSorting: false, enableCellEdit: false, cellTemplate: '<div class="button" ng-click="grid.appScope.remove(row.entity)">Delete</div>' }
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

    // set grid data to organization plants
    var findPlants = function(){
      var organization = Organizations.get({ 
        organizationId: $stateParams.organizationId        
      }, function(organization){
        $scope.plantsGrid.data = organization.plants;
      });
    }

    findPlants();

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
        findPlants();
        $scope.message = plant.commonName + ', successfully deleted'
      })
    }

	}
]);