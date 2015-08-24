'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
		Schema = mongoose.Schema;

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
	owner: {
			type: Schema.ObjectId,
			ref: 'User'
	},
	members: [{
		memberId: {
			type: Schema.ObjectId,
			ref: 'User'
		},
		memberPermission: {
			type: String,
			enum: ['read', 'update', 'admin'],
			default: ['read']
		}
	}],
	mailingList: {
		type: String,
		trim: true		
	},
	plants: 	[{
		type: Schema.ObjectId,
		ref: 'Plant'
	}],
	contact: 	{
		phone: [{
			type: Number,
			trim: true	
		}],
		email: {
			type: String,
			match: [/.+\@.+\..+/, 'Please fill a valid email address']
		},
		website: {
			type: String,			
			trim: true
		},	
		address: 	{
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
		}
	},
	orders: [{
		type: Schema.ObjectId,
		ref: 'Order'		
	}],
});

mongoose.model('Organization', OrganizationSchema);