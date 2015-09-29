'use strict';

angular.module('core').factory('Helper',
	function() {
		return {
			arrayMax : function( array ){
			    return Math.max.apply( Math, array );
			},
			arrayMin : function( array ){
				return Math.min.apply( Math, array );
			},
      strReplaceDash : function (string) {
        return string.replace(/\s+/g, '-');
      }
		};
	}
);