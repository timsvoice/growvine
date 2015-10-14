'use strict';

angular.module('core').factory('Mailer', ['$resource',
	function($resource) {
		var resource, service;

    resource = {
    	send: $resource('/mailer/send',{},
	      { 
	        update: { 
	          method: 'PUT' 
	        }
	      }
	    )
    }

		service = {
			followRequest: function followRequest (requestor, owner, callback) {
				resource.send.get({}, {
					users: [owner],
					subject: "",
					template: 'test',
					variables: {
						requesterName: requestor.firstName,						
						ownerName: owner.firstName
					}
				}, function (res) {
					return callback(res);
				}, function (err) {
					console.log(err);
					return callback(err);
				})
			}
		};

		return {
			resource: resource,
			service: service
		}
	}
]);