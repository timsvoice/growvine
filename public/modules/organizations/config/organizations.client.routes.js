'use strict';

//Setting up route
angular.module('organizations').config(['$stateProvider',
	function($stateProvider) {
		// Organizations state routing
		$stateProvider.
		state('listOrganizations', {
			url: '/organizations',
			controller: 'OrganizationsController as orgVm',
			templateUrl: 'modules/organizations/views/list-organizations.client.view.html'
		}).
		state('createOrganization', {
			url: '/organizations/create',
			templateUrl: 'modules/organizations/views/create-organization.client.view.html'
		}).
		state('viewOrganization', {
			url: '/organizations/:organizationId',
			controller: 'OrganizationsController as orgVm',
			templateUrl: 'modules/organizations/views/view-organization.client.view.html',
		}).
		state('viewOrganization.plants', {
			url: '/plants',
			controller: 'PlantsController as plantsVm',
			templateUrl: 'modules/organizations/views/view-organization.plants.client.view.html',
		}).	
		state('viewOrganization.orders', {
			url: '/orders',
			controller: 'OrdersController as ordersVm',
			templateUrl: 'modules/organizations/views/view-organization.orders.client.view.html',
		}).	
		state('viewOrganization.about', {
			url: '/about',
			controller: 'PlantsController as plantsVm',
			templateUrl: 'modules/organizations/views/view-organization.about.client.view.html',
		}).			
		state('editOrganization', {
			url: '/organizations/:organizationId/edit',
			templateUrl: 'modules/organizations/views/edit-organization.client.view.html'
		});
	}
]);