'use strict';

angular.module('users').factory('Permissions', ['Authentication', 'Organizations', '$stateParams',
	function(Authentication, Organizations, $stateParams) {

		var permission;

		return {
			userPermissions: function(user, org, callback) {	      
	      var organization = Organizations.get({ 
	        organizationId: org        
	      }, organization, function(res){
	        var isMember = [];
	        for (var i = res.members.length - 1; i >= 0; i--) {
	          if(res.members[i].memberId === user._id) {
	            isMember.push(res.members[i]);
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