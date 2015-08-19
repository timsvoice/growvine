'use strict';

angular.module('organizations').controller('OrganizationGridController', ['$scope', '$stateParams', '$q', 'Organizations', 'Authentication', 'Plants',
	function($scope, $stateParams, $q, Organizations, Authentication, Plants) {
    
    $scope.authentication = Authentication;
    
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

    findPlants()
	}
]);