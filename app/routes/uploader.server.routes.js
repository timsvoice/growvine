'use strict';

module.exports = function(app) {
  var uploader = require('../../app/controllers/uploader.server.controller');

  // Organizations Routes
  app.route('/uploader/signing')
    .post(uploader.sign);
};