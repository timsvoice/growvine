'use strict';

angular.module('core').factory('Mailer', ['$resource',
	function($resource) {
		var resource, service;

    resource = {
    	send: $resource('/mailer/send',{})    	
    }

		service = {
			transaction: function transaction (requestor, owner, template, callback) {
				var user;
				
				if (template == '*.submit') {
					user = owner;
				} else if (template == '*.approve') {
					user = requestor;
				};

				resource.send.get({}, {
					users: [user],
					subject: requestor.firstName + " wants to see your availability!",
					template: template,
					variables: {
						requesterName: requestor.firstName,						
						ownerName: owner.firstName
					}
				}, function (res) {
					return callback(res);
				}, function (err) {
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