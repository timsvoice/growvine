'use strict';

//Organizations service used to communicate Organizations REST endpoints
angular.module('organizations').factory('Organizations', ['$resource', '$rootScope', 'Uploader', 'Helper',
	function($resource, $rootScope, Uploader, Helper) {
		
    var resource = $resource('organizations/:organizationId', { organizationId: '@_id'
		}, {
			update: { method: 'PUT' }
		});

    var service = {
      
      createOrganization: function createOrganization (user, organization) {
        // Create new Organization object
        var organization = new Organizations(organization);
        
        // set org members array
        organization.members = [];
        // set owner to creating user
        organization.owner = user._id;
        // add user as member
        organization.members.push({
          memberId: user._id,
          memberPermission: 'admin'
        });           
        // Redirect after save
        organization.$save(function (organization) {        
          response = {
            message: organization.name + " has been created!",
            organization: organization
          }
          $rootScope.$broadcast('organizations.update', {message: response.message})
          return callback(response);
        }, function (error) {
          response = {
            message: "There was an error saving your organization. Please try again",
            error: error
          }
          $rootScope.$broadcast('organizations.error', {message: response.message})          
        });
      },

      updateOrganization: function updateOrganization (organization, callback) {          
        organizations.resource.update( {organizationId: organization._id}, organization, function (updatedorganization) {
          response = {
            message: (updatedorganization.commonName || "organization") + " has been updated.",
            organization: updatedorganization
          }
          $rootScope.$broadcast('organizations.update', {message: response.message})
          return callback(response)       
        }, function (error) {
          response = {
            message: "Unable to update organization. Please try again later",
            error: error
          }
          return callback(response)          
        });
      },

      removeOrganization: function removeOrganization (organization, callback) {      
        resource.delete( {organizationId: organization._id}, organization, function (organization) {
          response = {
            message: (organization.commonName || "organization") + " has been deleted.",
            organization: organization
          }
          $rootScope.$broadcast('organizations.update', {message: response.message})
          return callback(response)        
        }, function (error) {
          response = {
            message: "Unable to delete organization. Please try again later",
            error: error
          }
          return callback(response)          
        });
      },

      // Find a list of organization
      findAllOrganizations: function findAllOrganizations (callback) {      
        resource.query(function (organizations) {
          console.log(organizations);
          return callback(organizations)
        }, function (error) {
          response = {
            message: "Unable to get organizations. Please try again later",
            error: error
          }
          return callback(response)
        })
      },

      // Find existing organization
      findOrganization: function findOrganization (id, callback) {
        resource.get( {organizationId: id}, function (organization) {
          return callback({
            organization: organization
          })        
        }, function (error) {
          response = {
            message: "Unable to get organization. Please try again later",
            error: error
          }
          return callback(response)
        })
      },

      uploadProfileImage: function uploadProfileImage (file, organization, callback) {
        var name = 'profile-image-',
            organization = organization,
            request = {
              file: file,
              id: organization._id,
              name: name,
              organizationName: Helper.strReplaceDash(organization.name)
            };

        Uploader.uploadImage(request)
          .then(function (response) {     
            organization.profileImage = response.url;   

            resource.update({ organizationId: organization._id }, organization, function (organization) {
              response = {
                message: file.name + "for " + (organization.commonName || "organization") + " image uploaded.",
                organization: organization
              }
              $rootScope.$broadcast('organizations.update', {message: response.message});
              return callback(response)
            }, function (error) {
              response = {
                message: "Unable to upload image. Please try again later",
                error: error
              }
              $rootScope.$broadcast('organizations.error', {message: "Unable to upload image. Please try again later"});              
              return callback(response)
            });         
        }).catch(function (error) {
            response = {
              message: "Unable to upload image. Please try again later",
              error: error
            }
            $rootScope.$broadcast('organizations.error', {message: "Unable to upload image. Please try again later"});
            return callback (response)
        });      
      } 

    }

    return {
      resource: resource,
      service: service
    }
	}
]);