'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Plant = mongoose.model('Plant'),
	Organization = mongoose.model('Organization'),
	_ = require('lodash');

var message, error;

/**
 * Create a Plant
 */
exports.create = function(req, res) {
	// Create a new Plant model instance
	var plant = new Plant(req.body);

	Organization.findById(req.user.organization, function(err, organization) {
		if (organization) {
			// set organization organization to new org
			organization.plants.push(plant);
			organization.save(function(err, response){
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

	plant.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(plant);
		}
	});
};

/**
 * Show the current Plant
 */
exports.read = function(req, res) {
	res.jsonp(req.plant);
};

/**
 * Update a Plant
 */
exports.update = function(req, res) {
	var plant = req.plant;

	plant = _.extend(plant , req.body);

	plant.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(plant);
		}
	});
};

/**
 * Delete an Plant
 */
exports.delete = function(req, res) {
	var plant = req.plant ;

	plant.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(plant);
		}
	});
};

/**
 * List of Plants
 */
exports.list = function(req, res) { 
	Plant.find().sort('-created').populate('user', 'displayName').exec(function(err, plants) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(plants);
		}
	});
};

/**
 * Plant authorization middleware
 */

/**
 * Plant middleware
 */
exports.plantByID = function(req, res, next, id) { 
	Plant.findById(id).populate('organization').exec(function(err, plant) {
		if (err) return next(err);
		if (! plant) return next(new Error('Failed to load plant ' + id));
		req.plant = plant ;
		next();
	});
};

/**
 * plant authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	// var authorizedUsers = [];
	// for (var i = req.plant.organization.members.length - 1; i >= 0; i--) {
	// 	if (String(req.plant.organization.members[i].memberId) === req.user.id) {
	// 		authorizedUsers.push(req.plant.owners[i].memberId);
	// 	}
	// };
	// if (authorizedUsers.length < 1) {
	// 	return res.status(403).send('User is not authorized');
	// }
	next();
};