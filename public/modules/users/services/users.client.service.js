'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		
    var resource = $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});

    var service = {
      
      userAuthorization: function authorizedUser (user, organization) {
        var approved;
        var approvalQuery = organization.approvedUsers.indexOf(user._id);           
        
        if (approvalQuery != -1) { approved = true; } 
        else { approved = false; }
        
        return approved;
      },

      userRole: function userRole (organization) {
        var userPermission;            
        
        if (user.organization == organization._id) {
          userPermission = 'owner';
        } else {
          userPermission = 'user';
        }

        return userPermission;
      }

    }

    return {
      resource: resource,
      service: service
    }
	}
]);