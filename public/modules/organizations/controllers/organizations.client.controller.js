'use strict';

// Organizations controller
angular.module('organizations').controller('OrganizationsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Organizations', 'PlantQuery', 'FormlyForms', 'Permissions', 'Plants', 'FoundationApi', 'Uploader',
	function($scope, $http, $stateParams, $location, Authentication, Organizations, PlantQuery, FormlyForms, Permissions, Plants, FoundationApi, Uploader) {
		$scope.authentication = Authentication;

    // set current user permissions
    Organizations.get({
      organizationId: $stateParams.organizationId
    }, function (organization) {      
      var isMember = [];
      for (var i = organization.members.length - 1; i >= 0; i--) {
        if(organization.members[i].memberId === $scope.authentication.user._id) {
          isMember.push(organization.members[i]);
        }
      };
      if (isMember.length < 1) {
        return $scope.userPermission = 'user';  
      } else {
        return $scope.userPermission = 'owner';
      }
    });

    // set organization plants
    PlantQuery.findPlants($stateParams.organizationId, function(orgPlants){
      $scope.plantsGrid = {};      
      var plants = orgPlants;
      $scope.plantsGrid.data = plants;          
    });

    $scope.newAvailability = {
        date: '',
        quantity: '',
    };
      
    $scope.formUpdateAvailability = FormlyForms.updateAvailability();

    // register orgData model
		$scope.orgObj = {
			type: '',
			name: '',
			description: '',
      owner: '',
      members: [],
      mailingList: '',
      contact: {
      	phone: 0,
      	email: '',
      	website: '',
      	address: {
      		street: '',
      		city: '',
      		state: '',
      		zip: 0
      	}
      }
		}

    // organization form from formly service
		$scope.formCreateOrg = FormlyForms.createOrganization($scope.orgObj);

    // Create new Organization
    $scope.create = function() {
      // Get user object
      var user = $scope.authentication.user;
      // Create new Organization object
      var organization = new Organizations($scope.orgObj);
      
      // set org type to user role
      if (user.role !== 'admin') {
        organization.type === user.role;
      } else {
        $scope.error = "admin can't make an organization"
      }
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
      organization.$save(function(response) {        
        // redirect to organization home page
        $location.path('organizations/' + response._id);
        // Clear form fields
        $scope.name = '';
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

		// Remove existing Organization
		$scope.remove = function(organization) {
      if ( organization ) { 
				organization.$remove();

				for (var i in $scope.organizations) {
					if ($scope.organizations [i] === organization) {
						$scope.organizations.splice(i, 1);
					}
				}
			} else {
				$scope.organization.$remove(function() {
					$location.path('organizations');
				});
			}
		};

		// Update existing Organization
		$scope.update = function() {
			var organization = $scope.organization;
			organization.$update(function() {
				$location.path('organizations/' + organization._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Organizations
		$scope.find = function() {			
      $scope.organizations = Organizations.query();
		};

		// Find existing Organization
		$scope.findOne = function() {
			$scope.organization = Organizations.get({ 
				organizationId: $stateParams.organizationId
			});
		};

    // Plant Function

    $scope.updatePlant = function(plant) {
      // close modal
      FoundationApi.closeActiveElements();      
      Plants.update({
        plantId: plant._id
      }, plant, function () {
          $scope.message = plant.commonName + ', successfully updated'          
        }
      );
    };

    $scope.removePlant = function(plant) {
      // $scope.plantsGrid.data.splice(plant.$index, 1);
      console.log(plant);
      Plants.delete({
        plantId: plant._id
      }, plant, function(){        
        // remove object from $scope data
        $scope.message = plant.commonName + ', successfully deleted'
      })
    }

    // Profile Functions

    $scope.uploadProfile = function (file, type) {
      var organization = $scope.organization
      Uploader.uploadImage($scope.organization.name, file, type, function (result) {
        $scope.message = result.message;     
        organization.profileImage = result.url;   
        // if response success update db
        if (result.message) {
          organization.$update(function(res){            
            $scope.message = "Profile Updated";
          }, function(err){
            $scope.error = err;
          })          
        };

      });      
    }

    // Availability Functions

    $scope.updateAvailability = function (plant) {
      $scope.plant = plant;
    }

    $scope.addAvailability = function (plant) {
      var availability = {
        date: $scope.newAvailability.date,
        quantity: $scope.newAvailability.quantity
      }
      $scope.plant.unitAvailability.push(availability);
      Plants.update({
        plantId: plant._id
      }, plant, function (res) {
          $scope.plant = res;
          $scope.message = plant.commonName + ', successfully updated'
          $scope.newAvailability = {
            date: '',
            quantity: ''
          };
        }
      );
    }

    $scope.removeAvailability = function (availability, plant) {      
      $scope.plant.unitAvailability.splice(availability.$index, 1);
      Plants.update({
        plantId: plant._id
      }, plant, function (res) {
          $scope.plant = res;
          $scope.message = plant.commonName + ', successfully updated'
        }
      );
    }

  }
]);