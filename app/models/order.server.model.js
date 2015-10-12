'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Order Schema
 */
var OrderSchema = new Schema({
	shipTo: {
		firstName: {
			type: String,
			trim: true
		},
		lastName: {
			type: String,
			trim: true
		},
		street: {
			type: String,
			trim: true
		},
		city: {
			type: String,
			trim: true
		},
		state: {
			type: String,
			trim: true
		},
		zip: {
			type: String,
			trim: true
		}
	},
	vendor: {
		type: Schema.ObjectId,
		ref: 'Organization',
		required: 'Order must have a vendor'
	},
	memo: {
		type: String
	},
	submitted: {
		type: Boolean,
		default: false
	},
	confirmed: {
		type: Boolean,
		default: false
	},
	invoiced: {
		type: Boolean,
		default: false
	},
	created: {
		type: Date,
		default: Date.now
	},
	createdUser: {
		type: Schema.ObjectId,
		ref: 'User',
		required: 'Order must have an user'
	},
	createdOrganization: {
		type: Schema.ObjectId,
		ref: 'Organization',
		required: 'Order must have an Organization'
	},
	plants: [{
		plant: {
			type: Schema.ObjectId,
			ref: 'Plant',
		},
		quantity: {
			type: Number
		},
		shipDate: {
			type: Date
		}
	}],
	discount: {
		amount: {
			type: Number,
			default: 0
		},
		percentage: {
			type: Number,
			default: 0
		}
	},
	tax: {
		city: {
			type: Number
		},
		state: {
			type: Number
		},
		federal: {
			type: Number
		}
	},
	totalCost: { 
		type: Number 
	}
});

mongoose.model('Order', OrderSchema);