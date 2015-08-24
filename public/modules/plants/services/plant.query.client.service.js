'use strict';

angular.module('plants').factory('PlantQuery', ['Organizations',
	function(Organizations) {

		return {
	    findPlants: function(org, callback) {
	      var organization = Organizations.get({ 
	        organizationId: org        
	      }, function(organization){
	        return callback(organization.plants);
	      });
	    }
		};
	}
]);