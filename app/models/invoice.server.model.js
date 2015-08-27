'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Invoice Schema
 */
var InvoiceSchema = new Schema({
	createdUser: {
		type: Schema.ObjectId,
		ref: 'User',
		required: 'Must have createdUser'
	},
	invoicer: {
		type: Schema.ObjectId,
		ref: 'Organization',
		required: 'Must have invoicer'
	},
	invoicee: {
		type: Schema.ObjectId,
		ref: 'Organization',
		required: 'Must have invoicee'
	},
	// customer: {
	// 	type: Schema.ObjectId,
	// 	ref: 'User'
	// },
	amount: {
		type: Number,
		trim: true,
		required: 'Must have total amount'
	},
	currency: {
		type: String,
		enum: ['usd'],
		default: ['usd'],
		required: 'Must have currency'		
	},
	discount: {
		type: Number,
	},
	markup: {
		type: Number,
	},
	taxes: {
		stateTaxes: {
			type: Number
		},
		federalTaxes: {
			type: Number
		},
		otherTaxes: {
			type: Number
		}
	},
	terms: {
		days: {
			type: Number,
			required: 'Invoice must have terms'
		}
	},
	paid: {
		type: Boolean,
		default: false
	},
	plants: [{
		type: Schema.ObjectId,
		ref: 'Plant',
		required: 'Must have plants'
	}],
	order: {
		type: Schema.ObjectId,
		ref: 'Order',
		required: 'Must be associated with an order'
	},
	shipping: {
		amount: {
			type: Number
		},
		taxes: {
			stateTaxes: {
				type: Number
			},
			federalTaxes: {
				type: Number
			},
			otherTaxes: {
				type: Number
			}
		},
		terms: {
			shipDate: {
				type: Date,
			},
			deliveryDate: {
				type: Date,
			},
			carrier: {
				type: String,
				trim: true
			},
		},
		memo: {
			type: String,
			trim: true
		}
	},
	memo: {
		type: String,
		trim: true
	},
	sent: {
		type: Boolean,
		default: false
	},
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Invoice', InvoiceSchema);