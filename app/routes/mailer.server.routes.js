'use strict';

module.exports = function(app) {
  var mailer = require('../../app/controllers/mailer.server.controller');

  // mailer Routes  
  app.route('/mailer/create')
    .get(mailer.mailInliner, mailer.mailCreator);    

  app.route('/mailer/send')
    .get(mailer.mailInliner, mailer.mailSender);

};