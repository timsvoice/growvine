'use strict';

angular.module('core').factory('Uploader', ['Upload', '$http',
	function(Upload, $http) {
		// Uploader service logic
		// ...

		// Public API
		return {
	    uploadImage : function (organization, file, type, callback) {      
	      // change file name
	      var filename = file.name;	     	      
	      var fileName = 'profile-image.' + filename.substr(filename.lastIndexOf('.')+1),
	      		status;
	      // construct query
	      var query = {
	        organization: organization,
	        filename: fileName,
	        type: file.type
	      };
	      // post file
	      $http.post('/uploader/signing', query)
	        .success(function(result) {
						// uploader
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
	            file: file
	          }).progress(function(evt) {
	            // progress method
	            status = 'progress: ' + parseInt(100.0 * evt.loaded / evt.total);
	            return callback(status);
	          }).success(function(data, status, headers, config) {
	            // file is uploaded successfully
	            status = {
	            	message: 'file ' + config.file.name + ' is uploaded successfully',
	            	url: config.url + config.fields.key,
	            	file: config.file,
	            	data: data
	            };
	            return callback(status);
	          }).error( function(err) {
	            // return error
	            status = 'error: ' + err;
	            return callback(status);
	          });
	        })
	        .error(function(data, status, headers, config) {
	          return status;
	        });
	    }
		};
	}
]);


