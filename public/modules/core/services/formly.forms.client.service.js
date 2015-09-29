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
		          class: "organization-name",
		          required: true,
		          lable: 'Organizations Name',
		          placeholder: 'Clear Water Greenery'
		        }
		      },
		      {
		      	type: 'select',
		        key: 'type',
		        templateOptions: {
		          class: 'organization-type-select',
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
		      // {
		      //   type: 'repeatSection',
		      //   key: 'unitAvailability',
		      //   templateOptions: {
		      //     buttonText: 'Add new availability',
		      //     fields: [
		      //       {
		      //         type: 'date',
		      //         key: 'date',
		      //         templateOptions: {
		      //           required: true,
		      //           lable: 'Date Available',
		      //         }
		      //       },
		      //       {
		      //         type: 'input',
		      //         key: 'quantity',
		      //         templateOptions: {
		      //           required: true,
		      //           lable: 'Quantity Available',
		      //           placeholder: '100'
		      //         }
		      //       }
		      //     ]
		      //   }
		      // }
    		];
				return form;
			},
			updatePlant: function (model) {
				var form = [
		      {
		        type: 'input',
		        key: 'commonName',
		        // model: model.commonName,
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
		        // model: model.scientificName,
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
		        // model: model.unitSize,
		        templateOptions: {
		          required: true,
		          lable: 'Size',
		          placeholder: '2ft'
		        }
		      },
		      {
		        type: 'input',
		        key: 'unitPrice',
		        // model: model.unitPrice,
		        templateOptions: {
		          required: true,
		          lable: 'Unit Price',
		          placeholder: '$1'
		        }
		      },
		      {
		        type: 'input',
		        key: 'unitRoyalty',
		        // model: model.unitRoyalty,
		        templateOptions: {
		          // required: true,
		          lable: 'Royalty',
		          placeholder: '$0.25'
		        }
		      }
    		];
				return form;
			},
			updateAvailability: function(model){
				var form = [
	         	{
	            type: 'input',
	            key: 'quantity',
	            templateOptions: {
	              required: true,
	              lable: 'Quantity Available',
	              placeholder: '100'
	            }
	          },
	          {
	            type: 'date',
	            key: 'date',
	            templateOptions: {
	              required: true,
	              lable: 'Date Available',
	            }
	          }
		     ];
				return form;
			}
		};
	}
]);