'use strict';

//Plants service used to communicate Plants REST endpoints
angular.module('plants').factory('Plants', ['$resource', '$rootScope', 'Organizations', 'Uploader', 'Helper',
	function($resource, $rootScope, Organizations, Uploader, Helper) {
		var response;
    var plants = {
  
      resource: $resource('plants/:plantId', { plantId: '@_id' }, 
        {
    			update: {
    				method: 'PUT'
    			}
  		}),

      // Create new Plant
      createPlant: function createPlant (organization, plant, callback) {
        plant = new plants.resource(plant);      
        plant.organization = organization;
        
        plant.$save(function (plant) {                
          response = {
            message: (plant.commonName || "Plant") + " has been saved.",
            plant: plant
          }
          $rootScope.$broadcast('plants.update', { message: response.message})
          return callback(response)
        }, function (error) {
          response = {
            message: (plant.commonName || "Plant") + " cannot be saved. Please try again later",
            error: error
          }          
          $rootScope.$broadcast('plants.error', { message: response.message})
          return callback(response)
        });
      },

      // Find a list of Plants
      findAllPlants: function findPlants (callback) {      
        plants.resource.query({}, function (plants) {
          return callback(plants)
        }, function (error) {
          response = {
            message: "Unable to get plants. Please try again later",
            error: error
          }
          return callback(response)
        })
      },

      // Find a list of Plants
      findOrgPlants: function findPlants (organizationId, callback) {              
        Organizations.resource.get({ 
          organizationId: organizationId       
        }, function(organization){
          return callback(organization.plants);
        }, function (error) {
          response = {
            message: "Unable to get plants. Please try again later",
            error: error
          }
          return callback(response)          
        });
      },
      
      // Find existing Plant
      findPlant: function findPlant (id, callback) {
        plants.resource.get( {plantId: id}, function (plants) {
          return callback({
            plant: plant
          })        
        }, function (error) {
          response = {
            message: "Unable to get plant. Please try again later",
            error: error
          }
          return callback(response)
        })
      },

      updatePlant: function updatePlant (plant, callback) {          
        plants.resource.update( {plantId: plant._id}, plant, function (updatedPlant) {
          response = {
            message: (updatedPlant.commonName || "Plant") + " has been updated.",
            plant: updatedPlant
          }
          $rootScope.$broadcast('plants.update', {message: response.message})
          return callback(response)       
        }, function (error) {
          response = {
            message: "Unable to update plant. Please try again later",
            error: error
          }
          return callback(response)          
        });
      },

      removePlant: function removePlant (plant, callback) {      
        plants.resource.delete( {plantId: plant._id}, plant, function (plant) {
          response = {
            message: (plant.commonName || "Plant") + " has been deleted.",
            plant: plant
          }
          $rootScope.$broadcast('plants.update', {message: response.message})
          return callback(response)        
        }, function (error) {
          response = {
            message: "Unable to delete plant. Please try again later",
            error: error
          }
          return callback(response)          
        });
      },

      // Availability Functions
      addAvailability: function addAvailability (plant, availability, callback) {
        plant.unitAvailability.push(availability);
        response = {
          message: (plant.commonName || "Plant") + " has new availability.",
          plant: plant
        }
        return callback(response)     
      },

      removeAvailability: function removeAvailability (plant, index, callback) {      
        plant.unitAvailability.splice(index, 1);
        response = {
          message: "Availability removed",
          plant: plant
        }
        return callback(response) 
      },

      uploadPlantImage: function uploadPlantImage (file, plant, organization, callback) {
        var name = plant.commonName,
            plant = plant,
            request = {
              file: file,
              id: organization._id,
              name: Helper.strReplaceDash(name),
              organizationName: Helper.strReplaceDash(organization.name)
            };

        Uploader.uploadImage(request)
          .then(function (response) {     
            plant.image = response.url;   

            plants.resource.update({ plantId: plant._id }, plant, function (plant) {
              response = {
                message: file.name + "for " + (plant.commonName || "Plant") + " image uploaded.",
                plant: plant
              }
              $rootScope.$broadcast('plants.update', {message: response.message});
              return callback()
            }, function (error) {
              response = {
                message: "Unable to upload image. Please try again later",
                error: error
              }
              $rootScope.$broadcast('plants.error', {message: "Unable to upload image. Please try again later"});              
              return callback(response)
            });         
        }).catch(function (error) {
            response = {
              message: "Unable to upload image. Please try again later",
              error: error
            }
            $rootScope.$broadcast('plants.error', {message: "Unable to upload image. Please try again later"});
            return callback (response)
        });      
      }      

    }

    return plants;
	}
]);