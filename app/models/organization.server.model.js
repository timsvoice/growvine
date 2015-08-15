'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
		Schema = mongoose.Schema;

var AddressSchema = new Schema({
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
});

var ContactSchema = new Schema ({
	phone: [{
		type: { type: String },
		number: Number,		
	}],
	email: {
		type: String,
		match: [/.+\@.+\..+/, 'Please fill a valid email address']
	},
	website: {
		type: String		
	},	
	address: 	[AddressSchema],
});

// var OrderSchema = new Schema({
// 	orderNumber: {
// 		type: Number,
// 		default: 1,
// 		required: 'Order must have an order number'
// 	},
// 	shipTo: {
// 		type: String	
// 	},
// 	vendor: {
// 		type: String
// 	},
// 	memo: {
// 		type: String
// 	},	
// 	confirmed: {
// 		type: Boolean,
// 		default: false
// 	},
// 	invoiced: {
// 		type: Boolean,
// 		default: false
// 	},
// 	created: {
// 		type: Date,
// 		default: Date.now
// 	},
// 	createdBy: {
// 		type: Schema.ObjectId,
// 		ref: 'User',
// 		required: 'Order must have a user'
// 	},
// 	plants: [{
// 			commonName: {
// 				type: String,
// 				default: '',
// 				required: 'Please fill common name',
// 				trim: true
// 			},
// 			scientificName: {
// 				type: String,
// 				default: '',
// 				required: 'Please fill scientific name',
// 				trim: true
// 			},
// 			unitSize: {
// 				type: Number,
// 				required: 'Please fill available size',
// 			},
// 			unitPrice: {
// 				type: Number,
// 				required: 'Please fill price per unit'
// 			},
// 			unitMeasure: {
// 				type: String,
// 				required: 'Please fill in unit measure'
// 			},
// 			royalty: {
// 				type: Number
// 			},
// 			availability: [{
// 				date: {
// 					type: Date,
// 					default: Date.now
// 				},
// 				quantity: {
// 					type: Number,
// 					required: 'Please fill available quantity'
// 				}
// 			}],
// 			created: {
// 				type: Date,
// 				default: Date.now
// 			},
// 			orderQuantity: {
// 				type: Number
// 			}
// 	}],
// 	totalCost: { 
// 		type: Number 
// 	}
// });

/**
 * Organization Schema
 */
var OrganizationSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	type: {
		type: String,
		required: 'Please fill Organization type',
		enum: ['vendor', 'broker']
	},
	name: {
		type: String,
		default: '',
		trim: true,
		required: 'Please fill Organization name',
		unique: true
	},
	description: {
		type: String,
		trim: true
	},
	members: [{
		member_id: {
			type: Schema.ObjectId,
			ref: 'User'
		}
	}],
	mailingList: {
		type: String,
		trim: true		
	},
	plants: 	[{
		plant_id: {
			type: Schema.ObjectId,
			ref: 'Plant'
		}
	}],
	contact: 	[ContactSchema],
	// orders: 	[OrderSchema],
});

mongoose.model('Organization', OrganizationSchema);