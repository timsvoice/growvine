'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Organization = mongoose.model('Organization'),
	User = mongoose.model('User'),
	_ = require('lodash');

var message, error;

/**
 * Create a Organization
 */
exports.create = function(req, res) {
	var organization = new Organization(req.body);
	// set org owner to creating user
	organization.owner = req.user;
	User.findById(req.user._id, function(err, user) {
		
		if (user) {
			// set user organization to new org
			user.organization = organization._id;
			user.save(function(err, response){
				if (response) {
					message = organization.name + ' saved';
				} else {
					error = 'could not save organization: ' + err;
				}
			})
		} else {
			error = 'could not save organization: ' + err;
		}
	})


	organization.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(organization);
		}
	});
};

/**
 * Show the current Organization
 */
exports.read = function(req, res) {
	res.jsonp(req.organization);
};

/**
 * Update a Organization
 */
exports.update = function(req, res) {
	var organization = req.organization ;

	organization = _.extend(organization , req.body);

	organization.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(organization);
		}
	});
};

/**
 * Delete an Organization
 */
exports.delete = function(req, res) {
	var organization = req.organization ;

	organization.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(organization);
		}
	});
};

/**
 * List of Organizations
 */
exports.list = function(req, res) { 
	Organization.find().sort('-created').populate('owner').exec(function(err, organizations) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(organizations);
		}
	});
};

/**
 * Organization middleware
 */
exports.organizationByID = function(req, res, next, id) { 
	Organization.findById(id).populate('plants orders owner').exec(function(err, organization) {
		if (err) return next(err);
		if (! organization) return next(new Error('Failed to load Organization ' + id));
		req.organization = organization ;
		next();
	});
};

/**
 * Organization authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (String(req.organization.owner) !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

exports.hasOrganization = function(req, res, next) {
	if (req.user.organization === undefined) {
		return res.redirect('/#!/organizations/create');
		console.log('no org');
	}
	next();
};