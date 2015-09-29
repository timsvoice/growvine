'use strict';

angular.module('core').factory('Uploader', ['Upload', '$http', '$q',
	function(Upload, $http, $q) {
		// Uploader service logic
		// ...

		// Public API
		return {
	    uploadImage : function (req) {      
	      // setup promise
	      var deferred = $q.defer();

	      // change file name
	      var filename = req.file.name;	     	      
	      var fileName = req.id + '_' + req.name + '.' + filename.substr(filename.lastIndexOf('.')+1),
	      		status;
	      // construct query
	      var query = {
	        organization: req.organizationName,
	        filename: fileName,
	        type: req.file.type
	      };
	      // post file
	      $http.post('/uploader/signing', query)
	        .success(function(result) {
	          Upload.upload({
	            // AWS url
	            url: result.url,
	            // set headers
	            transformRequest: function(data, headersGetter) {
	              var headers = headersGetter();
	              delete headers.Authorization;
	              return data;
	            },
	            //credentials
	            fields: result.fields,
	            method: 'POST',
	            file: req.file
	          }).success(function(data, status, headers, config) {
	            // file is uploaded successfully
	            status = {
	            	message: 'file ' + config.file.name + ' is uploaded successfully',
	            	url: config.url + config.fields.key,
	            	file: config.file,
	            	data: data
	            };
	            deferred.resolve(status);
	          }).error( function(err) {
	            // return error
	            status = 'error: ' + err;
	            deferred.reject(status);
	          });
	        })
	        .error(function(data, status, headers, config) {
	          deferred.reject(status);
	        });

	        return deferred.promise;
	    }
		};
	}
]);


