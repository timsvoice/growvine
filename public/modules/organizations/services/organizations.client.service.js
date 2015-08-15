'use strict';

//Organizations service used to communicate Organizations REST endpoints
angular.module('organizations').factory('Organizations', ['$resource',
	function($resource) {
		return $resource('organizations/:organizationId', { organizationId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);