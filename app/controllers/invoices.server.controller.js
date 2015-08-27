'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Invoice = mongoose.model('Invoice'),
	_ = require('lodash');

/**
 * Create a Invoice
 */
exports.create = function(req, res) {
	var invoice = new Invoice(req.body);
	invoice.createdUser = req.user;
	// invoice.invoicer = req.user.organization;

	invoice.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(invoice);
		}
	});
};

/**
 * Show the current Invoice
 */
exports.read = function(req, res) {
	res.jsonp(req.invoice);
};

/**
 * Update a Invoice
 */
exports.update = function(req, res) {
	var invoice = req.invoice ;

	invoice = _.extend(invoice , req.body);

	invoice.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(invoice);
		}
	});
};

/**
 * Delete an Invoice
 */
exports.delete = function(req, res) {
	var invoice = req.invoice ;

	invoice.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(invoice);
		}
	});
};

/**
 * List of Invoices
 */
exports.list = function(req, res) { 
	Invoice.find().sort('-created').populate('createdOrganization').exec(function(err, invoices) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(invoices);
		}
	});
};

/**
 * Invoice middleware
 */
exports.invoiceByID = function(req, res, next, id) { 
	Invoice.findById(id).populate('createdOrganization').exec(function(err, invoice) {
		if (err) return next(err);
		if (! invoice) return next(new Error('Failed to load Invoice ' + id));
		req.invoice = invoice ;
		next();
	});
};

/**
 * Invoice authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	// if (String(req.user._id) !== String(req.invoice.createdUser)) {
	// 	return res.status(403).send('User is not authorized');
	// } else if (String(req.user.organization) !== String(req.invoice.invoicer)) {
	// 	return res.status(403).send('User is not authorized');
	// } 
	next();
};
