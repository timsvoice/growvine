'use strict';

// Organizations controller
angular.module('organizations').controller('OrganizationsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Organizations', 'PlantQuery', 'FormlyForms', 'Plants', 'FoundationApi', 'Uploader', 'Helper',
	function($scope, $http, $stateParams, $location, Authentication, Organizations, PlantQuery, FormlyForms, Plants, FoundationApi, Uploader, Helper) {
		var user = Authentication.user;
    $scope.authentication = Authentication;
    $scope.user = user;
      
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
			var userRole,
          authorizedUser,
          approved;

      authorizedUser = function (user, organization) {
        var approvalQuery = organization.approvedUsers.indexOf(user._id);           
        if (approvalQuery != -1) 
          { approved = true; } 
        else { approved = false; }
        return approved;
      };

      userRole = function (organization) {
        if (user.organization == organization._id) {
          $scope.userPermission = 'owner';
        } else {
          $scope.userPermission = 'user';
        }
      }      
    
      $scope.organization = Organizations.get({ 
				organizationId: $stateParams.organizationId
			}, function (organization) {
        $scope.authorized = authorizedUser(user, organization);
        userRole(organization);
        $scope.approvalRequests = organization.approvalRequests.length;
      });
		};

    $scope.requestAuthorization = function (user, organization) {
      var approvalRequest = {
            user: user._id,
            pending: true,
            approved: false
          },
          prevRequested = [];
      
      for (var i = organization.approvalRequests.length - 1; i >= 0; i--) {
        if (organization.approvalRequests[i].user === user._id) {
          prevRequested.push(1)
        }
      };

      if (prevRequested.length != 0) {
        $scope.message = "Looks like you have already requested authorization";
        console.log($scope.message);
      } else {
        organization.approvalRequests.push(approvalRequest);
        organization.$update( function (response) {
          $scope.message = "Your request has been sent. We will notify you when " + organization.name + " approves!";
        }, function (error) {
          $scope.error = "Sorry, we couldn't request authorization. Please try again later";
        });
      };
    };

    $scope.approveAuthorization = function (user, organization) {
      var request;

      for (var i = organization.approvalRequests.length - 1; i >= 0; i--) {
        if (organization.approvalRequests[i].user === user,_id) {
          request = organization.approvalRequests[i];
          organization.approvedUsers.push(request.user);
          organization.approvalRequests.splice(organization.approvalRequests[i]);
        }; 
      };      

      organization.$update( function (response) {
        $scope.message = user.name + " has been approved and can now access your availability!";
      }, function (error) {
        $scope.error = "Sorry, we couldn't approve this user right now. please try again later";
      })

    }

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