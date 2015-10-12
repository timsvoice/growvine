'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Order = mongoose.model('Order'),
	Plant = mongoose.model('Plant'),
	Organization = mongoose.model('Organization'),
	_ = require('lodash');

/**
 * Create a Order
 */
exports.create = function(req, res) {
	var order = new Order(req.body);

	order.createdUser = req.user._id;
	order.createdOrganization = req.user.organization;
	console.log(order);
	order.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			// save order to vendor if submitted
			if (order.submitted === true) {
				Organization.findById(order.vendor).exec(function (err, organization){
					console.log(organization);
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});					
					}
					organization.orders.push(order._id)
					organization.save(function (err, organization) {
						if (err) {
							return res.status(400).send({
								message: errorHandler.getErrorMessage(err)
							})
						}
					})
				})
			};
			// save order to user's organization
			Organization.findById(order.createdOrganization).exec(function (err, organization){
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});					
				};
					organization.orders.push(order._id)
					organization.save(function (err, res) {
						if (err) {
							return res.status(400).send({
								message: errorHandler.getErrorMessage(err)
							})
						}
					})				
			})
			res.jsonp(order);
		}
	});
};

/**
 * Show the current Order
 */
exports.read = function(req, res) {
	res.jsonp(req.order);
};

exports.orgOrders = function (req, res) {
	var criteria;	

	if (req.organization.type === 'vendor') {
		criteria = {vendor: req.organization._id}
	} else if (req.organization.type === 'broker') {
		criteria = {createdOrganization: req.organization._id}
	};

	Order.find(criteria)
		.populate('createdOrganization createdUser vendor')
		.populate({path: 'plants.plant', model: Plant})
		.exec(function(err, order){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(order);
			}			
		})
}

/**
 * Update a Order
 */
exports.update = function(req, res) {
	var order = req.order ;

	order = _.extend(order , req.body);

	order.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(order);
		}
	});
};

/**
 * Delete an Order
 */
exports.delete = function(req, res) {
	var order = req.order ;

	order.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(order);
		}
	});
};

/**
 * List of Orders
 */
exports.list = function(req, res) { 
	Order.find().sort('-created').populate('plants vendor createdUser createdOrganization').exec(function(err, orders) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(orders);
		}
	});
};

/**
 * Order middleware
 */
exports.orderByID = function(req, res, next, id) { 
	Order.findById(id).populate('plants vendor createdUser createdOrganization').exec(function(err, order) {
		if (err) return next(err);
		if (! order) return next(new Error('Failed to load Order ' + id));
		req.order = order;
		next();
	});
};

/**
 * Order authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (String(req.user._id) !== String(req.order.createdUser)
		|| String(req.organization._id) !== String(req.order.vendor)) {
		return res.status(403).send('User is not authorized');
	} else if (String(req.user.organization) !== String(req.order.createdOrganization)) {
		return res.status(403).send('User is not authorized');
	} 
	next();
};
