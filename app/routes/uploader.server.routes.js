'use strict';

module.exports = function(app) {
  var uploader = require('../../app/controllers/uploader.server.controller');

  // Uploader Routes
  app.route('/uploader/signing')
    .post(uploader.sign);
};