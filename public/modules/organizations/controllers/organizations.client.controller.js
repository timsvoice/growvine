'use strict';

// Organizations controller
angular.module('organizations').controller('OrganizationsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Organizations', 'PlantQuery', 'FormlyForms', 'Permissions', 'Plants', 'FoundationApi', 'Uploader', 'Helper',
	function($scope, $http, $stateParams, $location, Authentication, Organizations, PlantQuery, FormlyForms, Permissions, Plants, FoundationApi, Uploader, Helper) {
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
    $scope.createOrganization = function() {
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
		$scope.removeOrganization = function(organization) {
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
		$scope.updateOrganization = function() {
			var organization = $scope.organization;
			organization.$update(function() {
				$location.path('organizations/' + organization._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Organizations
		$scope.findOrganizations = function() {			
      $scope.organizations = Organizations.query();
		};

		// Find existing Organization
		$scope.findOrganization = function() {
			$scope.organization = Organizations.get({ 
				organizationId: $stateParams.organizationId
			});
		};

    // Profile Functions

    $scope.uploadProfileImage = function (file) {
      var organization = $scope.organization,
          name = 'profile-image';
      
      var request = {
        file: file,
        id: organization._id,
        name: name,
        organizationName: Helper.strReplaceDash(organization.name)
      };

      Uploader.uploadImage(request)
        .then(function (response) {
          console.log(response);
          $scope.message = response.message;     
          organization.profileImage = response.url;   
          // if response success update db
          if (response.message) {
            organization.$update(function(res){            
              $scope.message = "Profile Updated";
            }, function(err){
              $scope.error = err;
            })          
          };
      });      
    }

  }
]);