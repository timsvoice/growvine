'use strict';

// Organizations controller
angular.module('organizations').controller('OrganizationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Organizations', 'StatesList',
	function($scope, $stateParams, $location, Authentication, Organizations, StatesList) {
		$scope.authentication = Authentication;
    // register orgData
		$scope.orgData = {
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

    // organization form
		$scope.formCreateOrg = [
      {
        type: 'input',
        key: 'name',
        templateOptions: {
          required: true,
          lable: 'Organizations Name',
          placeholder: 'Clear Water Greenery'
        }
      },
      {
        type: 'select',
        key: 'type',
        templateOptions: {
          required: true,
          lable: 'Organizations Type',
          placeholder: 'vendor',
          options: [
          	{display: 'vendor', id: 'Vendor'},
          	{display: 'broker', id: 'Broker'}
          ],
          valueProp: 'display',
          labelProp: 'id'
        }
      },
      {
        type: 'input',
        key: 'description',
        templateOptions: {
          required: true,
          lable: 'Describe your organizations',
          placeholder: 'we are the best greenhouse in the land'
        }
      },
      {    		
    		model: $scope.orgData.contact,
    		type: 'input',
    		key: 'phone',
    		templateOptions: {
    			label: 'Phone',
    			placeholder: '123-456-7890'
    		}
    	},
    	{
    		model: $scope.orgData.contact,
    		type: 'input',
    		key: 'email',
    		templateOptions: {
    			label: 'Email',
    			placeholder: 'you@mail.com'
    		}
    	},
    	{
    		model: $scope.orgData.contact,
    		type: 'input',
    		key: 'website',
    		templateOptions: {
    			label: 'Website',
    			placeholder: 'http://www.yourbusiness.com'
    		}
    	},
    	{
    	  model: $scope.orgData.contact.address,	
    		type: 'input',
    		key: 'street',
    		templateOptions: {
    			label: 'Street',
    			placeholder: '123 Green Street'
    		}
    	},
    	{
    	  model: $scope.orgData.contact.address,	    		
    		type: 'input',
    		key: 'city',
    		templateOptions: {
    			label: 'City',
    			placeholder: 'Greenville'
    		}
    	},
    	{
    	  model: $scope.orgData.contact.address,	    		
    		type: 'select',
    		key: 'state',
    		templateOptions: {
    			label: 'State',
    			placeholder: 'Michigan',
    			options: StatesList,
    			valueProp: 'abbreviation',
    			labelProp: 'name'
    		}
    	},
    	{
    	  model: $scope.orgData.contact.address,	
    		type: 'input',
    		key: 'zip',
    		templateOptions: {
    			label: 'Phone',
    			placeholder: '123-456-7890'
    		}
    	},
		]

    // Create new Organization
    $scope.create = function() {
      // Get user object
      var user = $scope.authentication.user;   
      // Create new Organization object
      var organization = new Organizations($scope.orgData);
      
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
        // Create record of organization for user
        user.organization_id = organization._id;        
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
	}
]);