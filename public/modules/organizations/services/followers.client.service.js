'use strict';

angular.module('organizations').factory('Followers', [
	function() {
		var res,
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
	          error;
	      
	      for (var i = organization.approvalRequests.length - 1; i >= 0; i--) {
	        if (organization.approvalRequests[i].user === user._id) {
	          prevRequested.push(1)
	        }
	      };

	      if (prevRequested.length != 0) {
	        return callback(message = "Looks like you have already requested authorization");
	      } else {
	        organization.approvalRequests.push(approvalRequest);
	        organization.$update( function (res) {
	          return callback(message = "Your request has been sent. We will notify you when " + organization.name + " approves!");
	        }, function (err) {
	          return callback(error = "Sorry, we couldn't request authorization. Please try again later");
	        });
	      };
	    },
	    approve: function (user, organization, callback) {
	      var request,
	      		message,
	      		error,
	      		userName;

	      for (var i = organization.approvalRequests.length - 1; i >= 0; i--) {
	        if (organization.approvalRequests[i].user === user.user) {
	          request = organization.approvalRequests[i];
	          organization.approvedUsers.push(user.user);
	          organization.approvalRequests.splice([i], 1);
	        }; 
	      };      
	      organization.$update( function (response) {
	        userName = user.name;

	        return callback(
	        	res = {
	        		message: userName + " has been approved and can now access your availability!",
	        		organization: response
	      		});
	      }, function (error) {
	        return callback(	        	
	        	res = {
	        		message: userName + " has been approved and can now access your availability!",
	        		organization: response
	      		});
	      })

	    }
		};
	}
]);