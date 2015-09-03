'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'verdantree';
	var applicationModuleVendorDependencies = [
		'ngResource', 
		'ngCookies',  
		'ngAnimate',  
		'ngTouch',  
		'ngSanitize',  
		'ui.router', 
		'ui.utils',
		'ui.grid',
		'ui.grid.edit',
		'ui.grid.cellNav',
		'ui.grid.selection',
		'ui.grid.importer',
		'formly',
		'foundation'
	];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};
	
	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('invoices');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('orders');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('organizations');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('plants');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

// Setting up forms
angular.module('core').config(["formlyConfigProvider", function(formlyConfigProvider) {
    formlyConfigProvider.setType({
      name: 'input',
      templateUrl: '/modules/core/views/forms/input.html'
    });
    formlyConfigProvider.setType({
      name: 'select',
      templateUrl: '/modules/core/views/forms/select.html'
    });
    formlyConfigProvider.setType({
      name: 'password',
      templateUrl: '/modules/core/views/forms/password.html'
    });
    formlyConfigProvider.setType({
      name: 'date',
      templateUrl: '/modules/core/views/forms/date.html'
    });
    formlyConfigProvider.setType({
      name: 'repeatSection',
      templateUrl: '/modules/core/views/forms/repeatSection.html',
      controller: function($scope) {
        $scope.formOptions = {formState: $scope.formState};
        $scope.addNew = addNew;
        
        $scope.copyFields = copyFields;
        
        function copyFields(fields) {
          return angular.copy(fields);
        }
        
        function addNew() {
          $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
          var repeatsection = $scope.model[$scope.options.key];
          var lastSection = repeatsection[repeatsection.length - 1];
          var newsection = {};
          if (lastSection) {
            newsection = angular.copy(lastSection);
          }

          repeatsection.push(newsection);
        }
      }
    });
}]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

angular.module('core').factory('FormlyForms', ['StatesList',
	function(StatesList) {
		return {
			createUser: function(model) {
				var form =[
		      {
		        type: 'input',
		        key: 'email',
		        templateOptions: {
		        	class: 'user-signup-email',
		        	key: 'email',
		          required: true,
		          lable: 'Email',
		          placeholder: 'you@mail.com'
		        }
		      },
		      {
		        type: 'password',
		        key: 'password',
		        templateOptions: {
		        	class: 'user-signup-password',
		        	key: 'password',
		          required: true,
		          lable: 'Password',
		          placeholder: '********'
		        }
		      },		      		      		      
				]
				return form;				
		},
			signinUser: function(model) {
				var form =[
		      {
		        type: 'input',
		        key: 'email',
		        templateOptions: {
		        	class: 'user-signin-email',
		        	key: 'email',
		          required: true,
		          lable: 'Email',
		          placeholder: 'you@mail.com'
		        }
		      },
		      {
		        type: 'password',
		        key: 'password',
		        templateOptions: {
		        	class: 'user-signin-password',
		        	key: 'password',
		          required: true,
		          lable: 'Password',
		          placeholder: '********'
		        }
		      },		      		      		      
				]
				return form;				
			},			
			createOrganization: function(model) {
				var form = [
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
		    		model: model.contact,
		    		type: 'input',
		    		key: 'phone',
		    		templateOptions: {
		    			label: 'Phone',
		    			placeholder: '123-456-7890'
		    		}
		    	},
		    	{
		    		model: model.contact,
		    		type: 'input',
		    		key: 'email',
		    		templateOptions: {
		    			label: 'Email',
		    			placeholder: 'you@mail.com'
		    		}
		    	},
		    	{
		    		model: model.contact,
		    		type: 'input',
		    		key: 'website',
		    		templateOptions: {
		    			label: 'Website',
		    			placeholder: 'http://www.yourbusiness.com'
		    		}
		    	},
		    	{
		    	  model: model.contact.address,	
		    		type: 'input',
		    		key: 'street',
		    		templateOptions: {
		    			label: 'Street',
		    			placeholder: '123 Green Street'
		    		}
		    	},
		    	{
		    	  model: model.contact.address,	    		
		    		type: 'input',
		    		key: 'city',
		    		templateOptions: {
		    			label: 'City',
		    			placeholder: 'Greenville'
		    		}
		    	},
		    	{
		    	  model: model.contact.address,	    		
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
		    	  model: model.contact.address,	
		    		type: 'input',
		    		key: 'zip',
		    		templateOptions: {
		    			label: 'Phone',
		    			placeholder: '123-456-7890'
		    		}
		    	},
				]
				return form;
			},
			createPlant: function(model) {
				var form = [
		      {
		        type: 'input',
		        key: 'commonName',
		        templateOptions: {
		          required: true,
		          lable: 'Common Name',
		          placeholder: 'Big Leaf Maple'
		        },
		        id: 'common-name-input'        
		      },
		      {
		        type: 'input',
		        key: 'scientificName',
		        templateOptions: {
		          // required: true,
		          lable: 'Scientific Name',
		          placeholder: 'Acer Macrophyllum Pursh'
		        },
		        id: 'scientific-name-input' 
		      },
		      {
		        type: 'input',
		        key: 'unitSize',
		        templateOptions: {
		          required: true,
		          lable: 'Size',
		          placeholder: '2ft'
		        }
		      },
		      {
		        type: 'input',
		        key: 'unitPrice',
		        templateOptions: {
		          required: true,
		          lable: 'Unit Price',
		          placeholder: '$1'
		        }
		      },
		      {
		        type: 'input',
		        key: 'unitRoyalty',
		        templateOptions: {
		          // required: true,
		          lable: 'Royalty',
		          placeholder: '$0.25'
		        }
		      },
		      // repeatable section for adding availability
		      {
		        type: 'repeatSection',
		        key: 'unitAvailability',
		        templateOptions: {
		          buttonText: 'Add new availability',
		          fields: [
		            {
		              type: 'date',
		              key: 'date',
		              templateOptions: {
		                required: true,
		                lable: 'Date Available',
		              }
		            },
		            {
		              type: 'input',
		              key: 'quantity',
		              templateOptions: {
		                required: true,
		                lable: 'Quantity Available',
		                placeholder: '100'
		              }
		            }
		          ]
		        }
		      }
    		];
				return form;
			}
		};
	}
]);
// 'use strict';

// angular.module('core').factory('Helper', ['',
// 	function() {
// 		return {
// 			arrayMax = function( array ){
// 			    return Math.max.apply( Math, array );
// 			};
// 			arrayMax = function( array ){
// 				return Math.min.apply( Math, array );
// 			};
// 		};
// 	}
// ]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

//Plants service used to communicate Plants REST endpoints
angular.module('core').factory('StatesList', ['$resource',
	function($resource) {
		var states = [
		    {
		        "name": "Alabama",
		        "abbreviation": "AL"
		    },
		    {
		        "name": "Alaska",
		        "abbreviation": "AK"
		    },
		    {
		        "name": "American Samoa",
		        "abbreviation": "AS"
		    },
		    {
		        "name": "Arizona",
		        "abbreviation": "AZ"
		    },
		    {
		        "name": "Arkansas",
		        "abbreviation": "AR"
		    },
		    {
		        "name": "California",
		        "abbreviation": "CA"
		    },
		    {
		        "name": "Colorado",
		        "abbreviation": "CO"
		    },
		    {
		        "name": "Connecticut",
		        "abbreviation": "CT"
		    },
		    {
		        "name": "Delaware",
		        "abbreviation": "DE"
		    },
		    {
		        "name": "District Of Columbia",
		        "abbreviation": "DC"
		    },
		    {
		        "name": "Federated States Of Micronesia",
		        "abbreviation": "FM"
		    },
		    {
		        "name": "Florida",
		        "abbreviation": "FL"
		    },
		    {
		        "name": "Georgia",
		        "abbreviation": "GA"
		    },
		    {
		        "name": "Guam",
		        "abbreviation": "GU"
		    },
		    {
		        "name": "Hawaii",
		        "abbreviation": "HI"
		    },
		    {
		        "name": "Idaho",
		        "abbreviation": "ID"
		    },
		    {
		        "name": "Illinois",
		        "abbreviation": "IL"
		    },
		    {
		        "name": "Indiana",
		        "abbreviation": "IN"
		    },
		    {
		        "name": "Iowa",
		        "abbreviation": "IA"
		    },
		    {
		        "name": "Kansas",
		        "abbreviation": "KS"
		    },
		    {
		        "name": "Kentucky",
		        "abbreviation": "KY"
		    },
		    {
		        "name": "Louisiana",
		        "abbreviation": "LA"
		    },
		    {
		        "name": "Maine",
		        "abbreviation": "ME"
		    },
		    {
		        "name": "Marshall Islands",
		        "abbreviation": "MH"
		    },
		    {
		        "name": "Maryland",
		        "abbreviation": "MD"
		    },
		    {
		        "name": "Massachusetts",
		        "abbreviation": "MA"
		    },
		    {
		        "name": "Michigan",
		        "abbreviation": "MI"
		    },
		    {
		        "name": "Minnesota",
		        "abbreviation": "MN"
		    },
		    {
		        "name": "Mississippi",
		        "abbreviation": "MS"
		    },
		    {
		        "name": "Missouri",
		        "abbreviation": "MO"
		    },
		    {
		        "name": "Montana",
		        "abbreviation": "MT"
		    },
		    {
		        "name": "Nebraska",
		        "abbreviation": "NE"
		    },
		    {
		        "name": "Nevada",
		        "abbreviation": "NV"
		    },
		    {
		        "name": "New Hampshire",
		        "abbreviation": "NH"
		    },
		    {
		        "name": "New Jersey",
		        "abbreviation": "NJ"
		    },
		    {
		        "name": "New Mexico",
		        "abbreviation": "NM"
		    },
		    {
		        "name": "New York",
		        "abbreviation": "NY"
		    },
		    {
		        "name": "North Carolina",
		        "abbreviation": "NC"
		    },
		    {
		        "name": "North Dakota",
		        "abbreviation": "ND"
		    },
		    {
		        "name": "Northern Mariana Islands",
		        "abbreviation": "MP"
		    },
		    {
		        "name": "Ohio",
		        "abbreviation": "OH"
		    },
		    {
		        "name": "Oklahoma",
		        "abbreviation": "OK"
		    },
		    {
		        "name": "Oregon",
		        "abbreviation": "OR"
		    },
		    {
		        "name": "Palau",
		        "abbreviation": "PW"
		    },
		    {
		        "name": "Pennsylvania",
		        "abbreviation": "PA"
		    },
		    {
		        "name": "Puerto Rico",
		        "abbreviation": "PR"
		    },
		    {
		        "name": "Rhode Island",
		        "abbreviation": "RI"
		    },
		    {
		        "name": "South Carolina",
		        "abbreviation": "SC"
		    },
		    {
		        "name": "South Dakota",
		        "abbreviation": "SD"
		    },
		    {
		        "name": "Tennessee",
		        "abbreviation": "TN"
		    },
		    {
		        "name": "Texas",
		        "abbreviation": "TX"
		    },
		    {
		        "name": "Utah",
		        "abbreviation": "UT"
		    },
		    {
		        "name": "Vermont",
		        "abbreviation": "VT"
		    },
		    {
		        "name": "Virgin Islands",
		        "abbreviation": "VI"
		    },
		    {
		        "name": "Virginia",
		        "abbreviation": "VA"
		    },
		    {
		        "name": "Washington",
		        "abbreviation": "WA"
		    },
		    {
		        "name": "West Virginia",
		        "abbreviation": "WV"
		    },
		    {
		        "name": "Wisconsin",
		        "abbreviation": "WI"
		    },
		    {
		        "name": "Wyoming",
		        "abbreviation": "WY"
		    }
			]
			return states;
	}
]);
'use strict';

angular.module('core').factory('_', ['$window',
	function($window) {
		return $window._;
	}
]);
'use strict';

//Setting up route
angular.module('invoices').config(['$stateProvider',
	function($stateProvider) {
		// Invoices state routing
		$stateProvider.
		state('listInvoices', {
			url: '/invoices',
			templateUrl: 'modules/invoices/views/list-invoices.client.view.html'
		}).
		state('createInvoice', {
			url: '/invoices/create',
			templateUrl: 'modules/invoices/views/create-invoice.client.view.html'
		}).
		state('viewInvoice', {
			url: '/invoices/:invoiceId',
			templateUrl: 'modules/invoices/views/view-invoice.client.view.html'
		}).
		state('editInvoice', {
			url: '/invoices/:invoiceId/edit',
			templateUrl: 'modules/invoices/views/edit-invoice.client.view.html'
		});
	}
]);
'use strict';

// Invoices controller
angular.module('invoices').controller('InvoicesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Invoices', '_',
	function($scope, $stateParams, $location, Authentication, Invoices, _) {
		// globals
		var invoiceSubTotal, invoiceTotal;

		$scope.authentication = Authentication;
		
		// set adjustments for invoice
		$scope.adjustments = {
			discount: 0,
			markup: 0,
			taxes: {
				stateTaxes: 0,
				federalTaxes: 0,
				otherTaxes: 0
			}
		}
		
		// set shipping info
		$scope.shipping = {
			amount: 0,
			taxes: {
				stateTaxes: 0,
				federalTaxes: 0,
				otherTaxes: 0
			},
			terms: {
				shipDate: '',
				deliveryDate: '',
				carrier: ''				
			},
			memo: ''
		};
		$scope.terms = 0;
		// set memo
		$scope.memo = '';

		// Create new Invoice
		$scope.create = function(order, adjustments) {
			var adjustments = $scope.adjustments;
			// get total cost for plants in order
			var plantPrices = [];
			// gat plants			
			for (var i = order.plants.length - 1; i >= 0; i--) {
				var plantSubtotal = order.plants[i].unitPrice + order.plants[i].unitRoyalty; 
				plantPrices.push(plantSubtotal);				
			};			

			// sum the list
			if (plantPrices.length > 1) {
				var plantSum = _.reduce(plantPrices, function(memo, num){
					return memo + num;
				}, 0);
				// set plants total
				var plantTotal = plantSum;
			} else {
				plantTotal = plantPrices[0];				
			};
			
			// calculate appropriate total using discounts and markups
			if (adjustments.discount && !adjustments.markup) {
				invoiceSubTotal = plantTotal * (1 - (adjustments.discount)/100);
			} else if (adjustments.markup && adjustments.discount) {
				// diff markups and discounts
				if (adjustments.markup > adjustments.discount) {
					invoiceSubTotal = (plantTotal * (1+(adjustments.markup - adjustments.discount)/100))
				} else {
					invoiceSubTotal = (plantTotal * (1-(adjustments.discount - adjustments.markup)/100))			
				};
			} else if (adjustments.markup && !adjustments.discount) {
				invoiceSubTotal = plantTotal * (1 + (adjustments.markup)/100);
			} else {
				invoiceSubTotal = plantTotal;
			}

			// calculate tax
			invoiceTotal = invoiceSubTotal * (1 + ((adjustments.taxes.stateTaxes + adjustments.taxes.federalTaxes + adjustments.taxes.otherTaxes)/100));


			// create invoice object
			$scope.invoice = {
				createdUser: $scope.authentication.user._id,
				invoicer: $scope.authentication.user.organization,
				invoicee: order.createdOrganization,
				amount: Math.round(invoiceTotal * 100) / 100,
				discount: adjustments.discount,
				markup: adjustments.markup,
				taxes: adjustments.taxes,
				terms: $scope.terms,
				plants: order.plants,
				order: order._id,
				shipping: $scope.shipping,
				memo: $scope.memo
			};
			// Create new Invoice object
			var invoice = new Invoices ($scope.invoice);
			// Redirect after save
			invoice.$save(function(response) {				
				$location.path('invoices/' + response._id);
				$scope.invoice = {};
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Invoice
		$scope.remove = function(invoice) {
			if ( invoice ) { 
				invoice.$remove();

				for (var i in $scope.invoices) {
					if ($scope.invoices [i] === invoice) {
						$scope.invoices.splice(i, 1);
					}
				}
			} else {
				$scope.invoice.$remove(function() {
					$location.path('invoices');
				});
			}
		};

		// Update existing Invoice
		$scope.update = function() {
			var invoice = $scope.invoice;
			invoice.$update(function() {
				$location.path('invoices/' + invoice._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Invoices
		$scope.find = function() {
			$scope.invoices = Invoices.query();
		};

		// Find existing Invoice
		$scope.findOne = function() {
			$scope.invoice = Invoices.get({ 
				invoiceId: $stateParams.invoiceId
			});
		};
	}
]);
'use strict';

//Invoices service used to communicate Invoices REST endpoints
angular.module('invoices').factory('Invoices', ['$resource',
	function($resource) {
		return $resource('invoices/:invoiceId', { invoiceId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

//Setting up route
angular.module('orders').config(['$stateProvider',
	function($stateProvider) {
		// Orders state routing
		$stateProvider.
		state('listOrders', {
			url: '/orders',
			templateUrl: 'modules/orders/views/list-orders.client.view.html'
		}).
		state('createOrder', {
			url: '/orders/create',
			templateUrl: 'modules/orders/views/create-order.client.view.html'
		}).
		state('viewOrder', {
			url: '/orders/:orderId',
			templateUrl: 'modules/orders/views/view-order.client.view.html'
		}).
		state('editOrder', {
			url: '/orders/:orderId/edit',
			templateUrl: 'modules/orders/views/edit-order.client.view.html'
		});
	}
]);
'use strict';

// Orders controller
angular.module('orders').controller('OrdersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Orders', 'Organizations',
	function($scope, $stateParams, $location, Authentication, Orders, Organizations) {
		
		$scope.authentication = Authentication;
		
		// set empty array
		$scope.plants = [];

		$scope.addToOrder = function(plant) {			
			$scope.plants.push(plant._id);		
		}

		// Create new Order
		$scope.create = function(status) {			
			// Create new Order object
			var order = new Orders ($scope.order);						
			// set status
			if (status === 'submit') {
				order.submitted = true
			} else if (status === 'save') {
				order.submitted = false
			};
			// set order.plants to plants
			order.plants = $scope.plants;
			// show message if order is empty
			if ($scope.plants.length < 1) {
				$scope.plantsMessage = 'Add plants to your order'
			}
			// get last order.number to set this order number
			Orders.get(function(lastOrder){
				// if no order exists, set to 1
				if (lastOrder.length < 1) {
					order.orderNumber = 1;
				} else{
					order.orderNumber = lastOrder.orderNumber + 1;
				};													
				order.$save(function(response) {
					// test if order is saved or submitted
					if (response.submitted === true) {					
						// add to orgs orders if submitted
						Organizations.get({
							organizationId: order.vendor
						}, function(organization){							
							organization.orders.push(order._id)
							organization.$save();
							// flash message
							$scope.message = 'Your order has been submitted. You can check the status in "My Orders"';
						})
					} else {
						// flash message
						$scope.message = 'Your order has been saved.';
					};
					$location.path('/organizations/' + $scope.authentication.user.organization);
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			});
		};

		// Remove existing Order
		$scope.remove = function(order) {
			if ( order ) { 
				order.$remove();

				for (var i in $scope.orders) {
					if ($scope.orders [i] === order) {
						$scope.orders.splice(i, 1);
					}
				}

				Organizations.get({
					organizationId: order.vendor
				}, function(org){
						for (var i = org.orders.length - 1; i >= 0; i--) {
							if (org.orders[i] === order._id) {
								org.orders.splice(i, 1);
							}
						}
					})

					$location.path('/organizations' + $scope.authentication.user.organization);
					$scope.message = 'order successfully deleted'
			} else {
				$scope.order.$remove(function() {
					$location.path('/organizations' + $scope.authentication.user.organization);
					$scope.message = 'order successfully deleted'
				});
			}
		};

		// Update existing Order
		$scope.update = function() {
			var order = $scope.order;

			order.$update(function() {
				$location.path('/organizations/' + $scope.authentication.user.organization);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Orders
		$scope.find = function() {
			$scope.orders = Orders.query();
		};

		// Find existing Order
		$scope.findOne = function() {
			$scope.order = Orders.get({ 
				orderId: $stateParams.orderId
			});
		};
	}
]);
'use strict';

//Orders service used to communicate Orders REST endpoints
angular.module('orders').factory('Orders', ['$resource',
	function($resource) {
		return $resource('orders/:orderId', { orderId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

//Setting up route
angular.module('organizations').config(['$stateProvider',
	function($stateProvider) {
		// Organizations state routing
		$stateProvider.
		state('listOrganizations', {
			url: '/organizations',
			templateUrl: 'modules/organizations/views/list-organizations.client.view.html'
		}).
		state('createOrganization', {
			url: '/organizations/create',
			templateUrl: 'modules/organizations/views/create-organization.client.view.html'
		}).
		state('viewOrganization', {
			url: '/organizations/:organizationId',
			controller: 'OrganizationsController',
			templateUrl: 'modules/organizations/views/view-organization.client.view.html',
		}).
		state('editOrganization', {
			url: '/organizations/:organizationId/edit',
			templateUrl: 'modules/organizations/views/edit-organization.client.view.html'
		});
	}
]);
'use strict';

angular.module('organizations').controller('OrganizationGridController', ['$scope', '$stateParams', 'Organizations', 'Authentication', 'Plants', 'Permissions', 'PlantQuery',
	function($scope, $stateParams, Organizations, Authentication, Plants, Permissions, PlantQuery) {
    
    $scope.authentication = Authentication;
    
    // set current user permissions
    Permissions.userPermissions($scope.authentication.user, $stateParams.organizationId, function(permission){
      $scope.userPermission = permission;
    });

    // set organization plants
    PlantQuery.findPlants($stateParams.organizationId, function(orgPlants){
      $scope.plantsGrid.data = orgPlants;
    });

    // setup plants grid      
    $scope.plantsGrid = {       
      enableGridMenu: true,
      enableFiltering: true,
      showSelectionCheckbox: true,
      enableCellEditOnFocus: true, 
      enableRowSelection: true,
      enableSelectAll: false,
      columnDefs: [
        { name: 'commonName', displayName: 'Common Name', enableFiltering: true },
        { name: 'scientificName', displayName: 'Scientific Name', visible: true },
        { name: 'unitSize', displayName: 'Size', visible: true },
        { name: 'unitMeasure' , displayName: 'Units', visible: true, enableFiltering: false },
        { name: 'unitPrice' , displayName: 'Price', visible: true, enableFiltering: false },
        { name: '_id', visible: false },
        { name: 'delete', displayName: '', enableColumnMenu: false, enableSorting: false, enableCellEdit: false, cellTemplate: '<div class="button" ng-click="grid.appScope.remove(row.entity)">Delete</div>' }
      ],
      // save records imported through grid importer
      importerDataAddCallback: function ( grid, newObjects ) {
        // save each new record to the db
        for (var i = newObjects.length - 1; i >= 0; i--) {
          Plants.find().$add(newObjects[i])
        };          
      },
      // save changes made in grid
      onRegisterApi: function(gridApi) {
        // when unfocused on edited cell, save
        $scope.gridApi = gridApi;
        gridApi.edit.on.afterCellEdit($scope,$scope.update);
      }
    };    

    // Update existing Plant
    $scope.update = function(plant) {
      Plants.update({
        plantId: plant._id
      }, plant, function(){
          $scope.message = plant.commonName + ', successfully updated'
        }
      );
    };

    $scope.remove = function(plant) {
      Plants.delete({
        plantId: plant._id
      }, plant, function(){        
        // remove object from $scope data
        $scope.plantsGrid.data.splice(plant.$index, 1);
        $scope.message = plant.commonName + ', successfully deleted'
      })
    }
	}
]);
'use strict';

// Organizations controller
angular.module('organizations').controller('OrganizationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Organizations', 'FormlyForms',
	function($scope, $stateParams, $location, Authentication, Organizations, FormlyForms) {
		$scope.authentication = Authentication;

    // ensure user has an organization
    // var user = $scope.authentication.user;
    // if (!user.organization) {
    //   $location.path('/organizations/create')
    // };

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
	 
   // invoke functions for setup
   // $scope.userOrganization();
  }
]);
'use strict';

//Organizations service used to communicate Organizations REST endpoints
angular.module('organizations').factory('Organizations', ['$resource',
	function($resource) {
		return $resource('organizations/:organizationId', { organizationId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

//Setting up route
angular.module('plants').config(['$stateProvider',
	function($stateProvider) {
		// Plants state routing
		$stateProvider.
		state('listPlants', {
			url: '/plants',
			templateUrl: 'modules/plants/views/list-plants.client.view.html'
		}).
		state('createPlant', {
			url: '/plants/create',
			templateUrl: 'modules/plants/views/create-plant.client.view.html'
		}).
		state('viewPlant', {
			url: '/plants/:plantId',
			templateUrl: 'modules/plants/views/view-plant.client.view.html'
		}).
		state('editPlant', {
			url: '/plants/:plantId/edit',
			templateUrl: 'modules/plants/views/edit-plant.client.view.html'
		});
	}
]);
'use strict';

// Plants controller
angular.module('plants').controller('PlantsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Plants', 'Organizations','FormlyForms',
	function($scope, $stateParams, $location, Authentication, Plants, Organizations, FormlyForms) {
		$scope.authentication = Authentication;
    // register plant model
    $scope.plantObj = {
      organization: '',
      commonName: '',
      scientificName: '',
      unitSize: '',
      unitPrice: 0,
      unitRoyalty: 0,
      unitAvailability: [{
        date: new Date(),
        quantity: '100',
      }]
    };

    $scope.formCreatePlant = FormlyForms.createPlant($scope.plantObj);

		// Create new Plant
		$scope.create = function() {
			// register user on scope
			var user = $scope.authentication.user;
			// set plant organization to creating user org
			$scope.plantObj.organization = user.organization;
			// Create new Plant object
			var plant = new Plants ($scope.plantObj);
			// Redirect after save
			plant.$save(function(response) {
				$location.path('organizations/' + $scope.authentication.user.organization);
				// Clear form fields
				$scope.plantObj = {};
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Plant
		$scope.remove = function(plant) {
			if ( plant ) { 
				plant.$remove();

				for (var i in $scope.plants) {
					if ($scope.plants [i] === plant) {
						$scope.plants.splice(i, 1);
					}
				}
			} else {
				$scope.plant.$remove(function() {
					$location.path('plants');
				});
			}
		};

		// Update existing Plant
		$scope.update = function() {
			var plant = $scope.plant;

			plant.$update(function() {
				$location.path('plants/' + plant._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Plants
		$scope.find = function() {
			$scope.plants = Plants.query();
		};

		// Find existing Plant
		$scope.findOne = function() {
			$scope.plant = Plants.get({ 
				plantId: $stateParams.plantId
			});
		};
	}
]);
'use strict';

angular.module('plants').factory('PlantQuery', ['Organizations',
	function(Organizations) {

		return {
	    findPlants: function(org, callback) {
	      var organization = Organizations.get({ 
	        organizationId: org        
	      }, function(organization){
	        return callback(organization.plants);
	      });
	    }
		};
	}
]);
'use strict';

//Plants service used to communicate Plants REST endpoints
angular.module('plants').factory('Plants', ['$resource',
	function($resource) {
		return $resource('plants/:plantId', { plantId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', 'FormlyForms', 'FoundationApi',
	function($scope, $http, $location, Authentication, FormlyForms, FoundationApi) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.credentials = {
			email: '',
			password: ''
		}
		$scope.error = 'testing';
		// signup form from Formly Service
		$scope.formCreateUser = FormlyForms.createUser($scope.credentials);
		// signin form from Formly Service
		$scope.formSigninUser = FormlyForms.signinUser($scope.credentials);

		$scope.signup = function() {			
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;
				$scope.message = 'signed in'
				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				console.log(response.message);
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {			
			console.log('clicked');
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;
				// And redirect to the index page
				$scope.message = 'signed in'
				FoundationApi.closeActiveElements('signinModal');
				$location.path('/');
			}).error(function(response) {
				console.log(response.message);
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		$scope.deleteAccount = function(user) {
			// console.log(user);
			$http.delete('/users/delete', user).success(function(response){
				console.log('User deleted')				
				$http.get('/auth/signout').success(function(response){
					$location.path('/');
				}).error(function(response){
					console.log('user not signed out');
					console.log(response);
				})
			}).error(function(response){
				console.log('User not deleted')
			})
		}

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

angular.module('users').factory('Permissions', ['Authentication', 'Organizations', '$stateParams',
	function(Authentication, Organizations, $stateParams) {

		var permission;

		return {
			userPermissions: function(user, org, callback) {
	      var organization = Organizations.get({ 
	        organizationId: org        
	      }, function(organization){
	        var isMember = [];
	        for (var i = organization.members.length - 1; i >= 0; i--) {
	          if(organization.members[i].memberId === user._id) {
	            isMember.push(organization.members[i]);
	          }
	        };
	        if (isMember.length < 1) {
	          return callback('user');	
	        } else {
	          return callback('owner');
	        }
	      });  
			}
		};
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);