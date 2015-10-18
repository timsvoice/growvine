'use strict';

angular.module('core').factory('Mailer', ['$resource',
	function($resource) {
		var resource, service;

    resource = {
    	send: $resource('/mailer/send',{})    	
    }

		service = {
			transaction: function (requestor, owner, action, callback) {
				var user;
				
				if (action === 'submit') {
					user = owner;
				} else if (action === 'approve') {
					user = requestor;
				};
				
				resource.send.save({}, {
					users: [user],
					subject: requestor.firstName + " wants to see your availability!",
					template: 'follow.' + action,
					variables: {
						requesterName: requestor.firstName,						
						ownerName: owner.firstName
					}
				}, function (res) {
					console.log(res)
					return callback(res);
				}, function (err) {
					console.log(err)
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