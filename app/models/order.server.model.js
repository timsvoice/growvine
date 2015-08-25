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
	orderNumber: {
		type: Number,
		default: 1,
		required: 'Order must have an order number'
	},
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
		type: Schema.ObjectId,
		ref: 'Plant',
	}],
	totalCost: { 
		type: Number 
	}
});

mongoose.model('Order', OrderSchema);