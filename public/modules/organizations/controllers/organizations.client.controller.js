'use strict';

// Organizations controller
angular.module('organizations').controller('OrganizationsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Organizations', 'PlantQuery', 'FormlyForms', 'Plants', 'FoundationApi', 'Uploader', 'Helper', 'Followers', 'Users', 'Orders',
	function($scope, $http, $stateParams, $location, Authentication, Organizations, PlantQuery, FormlyForms, Plants, FoundationApi, Uploader, Helper, Followers, Users, Orders) {

    var orgVm = this,
        orderError;

    ////
    //  Initialization
    ////

    var init = function init () {
      var user = Authentication.user;
      orgVm.authentication = Authentication;
      orgVm.user = user;
      if ($location.path() == '/organizations') {        
        Organizations.service.findAllOrganizations(function (organizations) {          
          // set organizations on scope
          orgVm.organizations = organizations;
        })
      } else {
        Organizations.service.findOrganization($stateParams.organizationId, function (response) {
          // set user permission owner/user
          orgVm.userPermission = Users.service.userRole(response.organization);
          // set user authorization for availability
          orgVm.userAuthorization = Users.service.userAuthorization(orgVm.user, response.organization);
          // set organization
          orgVm.organization = response.organization;
          return response.organization;
        }) 
      };     
    }

    init()

    ////
    //  Messaging
    ////

    orderError = function orderError (message) {
      FoundationApi.publish('error-notifications',            
        { 
          title: 'Error', 
          content: message,
          autoclose: 2500
        }
      );      
    }

    $scope.$on('organizations.update', function (event, args) {
      $scope.message = args.message;
      FoundationApi.publish('success-notifications',            
        { 
          title: 'Success', 
          content: $scope.message,
          autoclose: 2500,
        }
      );
    }); 

    $scope.$on('organizations.error', function (event, args) {
      $scope.message = args.message;
      FoundationApi.publish('error-notifications',            
        { 
          title: 'Error', 
          content: $scope.message,
          autoclose: 2500
        }
      );
    })

    $scope.$on('followers.update', function (event, args) {
      $scope.message = args.message;
      FoundationApi.publish('success-notifications',            
        { 
          title: 'Success', 
          content: $scope.message,
          autoclose: 2500,
        }
      );
    }); 

    $scope.$on('followers.error', function (event, args) {
      $scope.message = args.message;
      FoundationApi.publish('error-notifications',            
        { 
          title: 'Error', 
          content: $scope.message,
          autoclose: 2500
        }
      );
    })

    $scope.$on('orders.update', function (event, args) {
      $scope.message = args.message;
      FoundationApi.publish('success-notifications',            
        { 
          title: 'Success', 
          content: $scope.message,
          autoclose: 2500
        }
      );
    })

    ////
    //  Forms
    ////
      
    orgVm.formUpdateAvailability = FormlyForms.updateAvailability();

    // register orgData model
		orgVm.orgObj = {
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

    orgVm.order = {
      plants: [],
      totalCost: ''
    };
  
    // organization form from formly service
		orgVm.formCreateOrg = FormlyForms.createOrganization(orgVm.orgObj);

    ////
    // Order functions
    ////

    orgVm.addToOrder = function addToOrder (order, plant, quantity, availability) {
      if (quantity > availability.quantity) {
        orderError("Cannot order more than are available");
      } else {
        Orders.service.addToOrder(order, plant, quantity, availability, function (response) {        
          orgVm.quantity = '';
        })
      } 
    }

    orgVm.removeFromOrder = function removeFromOrder (order, item, quantity, availability, index) {
      Orders.service.removeFromOrder(order, item, quantity, availability, index, function (response) {        
      })
    }

    orgVm.createOrder = function saveOrder (action, order, user, organization) {
      if (order.plants.length > 0) {
        Orders.service.createOrder(action, order, user, organization, function (response) {
          orgVm.order = {
            plants: []
          };
          $location.path('/organizaitons/' + user.organization);
        });
      };
    }

    ////
    // Follower functions
    ////

    orgVm.requestAuthorization = function requestAuthorization (user, organization) {
      Followers.request(user, organization);
    }

    orgVm.approveUser = function approveUser (user, organization) {
      Followers.approve(user, organization, function (response) {
        orgVm.organization = response.organization;
      })
    }

    orgVm.denyUser = function denyUser (user, organization) {
      Followers.deny(user, organization)
    }

    orgVm.revokeUser = function revokeUser (user, organization) {
      Followers.revoke(user, organization, function (response) {
        orgVm.organization = response.organization;
      })
    }

    // Profile Functions

    orgVm.uploadProfileImage = function uploadProfileImage (file) {
      Organizations.service.uploadProfileImage(file, orgVm.organization, function (response) {
        orgVm.organization = response.organization;
      });     
    }

  }
]);