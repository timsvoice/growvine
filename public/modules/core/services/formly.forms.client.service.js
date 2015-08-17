'use strict';

angular.module('core').factory('FormlyForms', ['StatesList',
	function(StatesList) {
		return {
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
			}
		};
	}
]);