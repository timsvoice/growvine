'use strict';

angular.module('users').factory('Permissions', ['Authentication', 'Organizations', '$stateParams',
	function(Authentication, Organizations, $stateParams) {

		var permission;

		return {
			userPermissions: function(user, org, callback) {
	      var organization = Organizations.get({ 
	        organizationId: org        
	      }, function(organization){
	        var isMember = [];
	        for (var i = organization.members.length - 1; i >= 0; i--) {
	          if(organization.members[i].memberId === user._id) {
	            isMember.push(organization.members[i]);
	          }
	        };
	        if (isMember.length < 1) {
	          return callback('user');	
	        } else {
	          return callback('owner');
	        }
	      });  
			}
		};
	}
]);