'use strict';

angular.module('core').factory('_', ['$window',
	function($window) {
		return $window._;
	}
]);