'use strict';

module.exports = function(app) {
  var mailer = require('../../app/controllers/mailer.server.controller');

  // mailer Routes  
  app.route('/mailer/create')
    .post(mailer.mailInliner, mailer.mailCreator);    

  app.route('/mailer/send')
    .post(mailer.mailInliner, mailer.mailSender);

};