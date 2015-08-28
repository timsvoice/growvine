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