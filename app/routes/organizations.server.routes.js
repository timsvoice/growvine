'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var organizations = require('../../app/controllers/organizations.server.controller');
	var orders = require('../../app/controllers/orders.server.controller');

	// Organizations Routes
	app.route('/organizations')
		.get(users.requiresLogin, organizations.list)
		.post(users.requiresLogin, organizations.create);

	app.route('/organizations/:organizationId')
		.get(users.requiresLogin, organizations.read)
		.put(users.requiresLogin, organizations.update)
		.delete(users.requiresLogin, organizations.hasAuthorization, organizations.delete);

	app.route('/organizations/:organizationId/orders')
		.get(users.requiresLogin, orders.orgOrders)

	// Finish by binding the Organization middleware
	app.param('organizationId', organizations.organizationByID);
};
