'use strict';

angular.module('organizations').factory('Followers', [ '$rootScope',
	function($rootScope) {
		var response,
				req;

		return {
			request: function (user, organization, callback) {
	      var approvalRequest = {
	            user: user._id,
	            pending: true,
	            approved: false
	          },
	          prevRequested = [],
	          message,
	          error,
	          orgName;
	      
	      for (var i = organization.approvalRequests.length - 1; i >= 0; i--) {
	        if (organization.approvalRequests[i].user === user._id) {
	          prevRequested.push(1)
	        }
	      };

	      if (prevRequested.length != 0) {
	        response = {
	        		message: "Looks like you have already requested authorization"
	      		}
	      	$rootScope.$broadcast('followers.error', {message: response.message})
	        return callback(response);
	      } else {
	        organization.approvalRequests.push(approvalRequest);
	        organization.$update( function (organization) {
	          response = {
		        		message: "Your request has been sent. We will notify you when " + organization.name + " approves!",
		        		organization: organization
	      		}
	      		$rootScope.$broadcast('followers.update', {message: response.message})
	          return callback(response);
	        }, function (error) {
	          response = {
		        		message: "Sorry, we couldn't request authorization. Please try again later",
		        		error: error
	      		}
	      		$rootScope.$broadcast('followers.error', {message: response.message})
	          return callback(response);
	        });
	      };
	    },
	    approve: function (user, organization, callback) {
	      var request,
	      		message,
	      		error;

	      for (var i = organization.approvalRequests.length - 1; i >= 0; i--) {
	        if (organization.approvalRequests[i].user === user.user) {
	          request = organization.approvalRequests[i];
	          organization.approvedUsers.push(user.user);
	          console.log(organization.approvedUsers);
	          organization.approvalRequests.splice([i], 1);
	        }; 
	      };      
	      organization.$update( function (response) {
	        response = {
        		message: user.name + " has been approved and can now access your availability!",
        		organization: response
      		}
      		$rootScope.$broadcast('followers.update', {message: response.message})
	        return callback(response);
	      }, function (error) {
        	response = {
        		message: "Sorry, we couldn't approve authorization. Please try again later",
        		error: error
      		}
      		$rootScope.$broadcast('followers.error', {message: response.message})	        
	        return callback(response);
	      })

	    },
	    deny: function (user, organization, callback) {

	      for (var i = organization.approvalRequests.length - 1; i >= 0; i--) {
	        if (organization.approvalRequests[i].user === user.user) {
	          organization.approvalRequests.splice([i], 1);
	          if (organization.approvedUsers[i] === user.user) {
	          	organization.approvedUsers.splice([i], 1);
	          	console.log(organization.approvedUsers);
	          };
	        }; 
	      };      
	      
	      organization.$update( function (response) {
        	response = {
        		message: user.name + " has been denied and can't access your availability!",
        		organization: response
      		}
      		$rootScope.$broadcast('followers.update', {message: response.message})
	        return callback(response);
	      }, function (error) {
        	response = {
        		message: "Sorry, we couldn't complete your request. Please try again later",
        		error: error
      		}	 
      		$rootScope.$broadcast('followers.error', {message: response.message})       
	        return callback(response);
	      })	    	
	    },
	    revoke: function (user, organization, callback) {
	      var message,
	      		error,
	      		userName;
	      
	      for (var i = organization.approvedUsers.length - 1; i >= 0; i--) {
	        if (organization.approvedUsers[i].user === user._id) {
	          organization.approvedUsers.splice([i], 1);
	        }; 
	      };  

	      organization.$update( function (response) {
        	response = {
        		message: user.name + " has been revoked and will no longer have access to your availability",
        		organization: response
      		}
      		$rootScope.$broadcast('followers.update', {message: response.message}) 
	        return callback(response);
	      }, function (error) {
        	response = {
        		message: "Sorry, we couldn't revoke this user's permission. Please try again later",
        		error: error
      		}	
      		$rootScope.$broadcast('followers.error', {message: response.message})        
	        return callback(response);
	      })	      
	    }

		};
	}
]);