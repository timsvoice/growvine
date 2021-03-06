'use strict';

// require your mailgun package
// Adding your key and domain to environment variables
// is important as you don’t want these values 
// in your source control or otherwise exposed.
// process.env is an easy way to access your env variables
var   mongoose = require('mongoose'),
      User = mongoose.model('User'),
      mailgun_api = process.env.MAILGUN_API_KEY,
      mailgun_domain = process.env.MAILGUN_VERDANTREE_DOMAIN,
      Mailgun = require('mailgun-js'),
      Q = require('q'),
      //use nunjucks to render html templates w/ variables
      nunjucks = require('nunjucks'),
      inlineCss = require('inline-css'),
      fs = require('fs');

// function to generate custom email
// for given users and return a mailing array
var mailCreator = function mailCreator (req, res) {
  var mailing = [],
      users = req.body.users;

  for (var i = users.length - 1; i >= 0; i--) {
    // get an email template and pass in some variables
    var email = nunjucks.render('./app/views/templates/email.' + req.body.template + '.inlined.template.html', {
      username: users[i].firstName
    });

    // add qualified users and their customized 
    // email to the mailing
    mailing.push({
      user: users[i].email,
      email: email 
    });
  }
  res.jsonp(mailing);
}

// function to send user email given template and subject     
var mailSender = function mailSender (req, res) {
    var users = req.body.users, 
        subject = req.body.subject, 
        template = req.body.template,
        html;

    // create new mailgun instance with credentials
    var mailgun = new Mailgun({
      apiKey: mailgun_api, 
      domain: mailgun_domain
    });
    for (var i = users.length - 1; i >= 0; i--) {
      html = nunjucks.render(
        './app/views/templates/email.' + req.body.template + '.inlined.template.html', 
        req.body.variables
      );
      // setup the basic mail data
      var mailData = {
        from: 'mail@verdantree.com',
        to: 'timsethvoice@gmail.com',
        subject: subject,
        html: html,
        'o:testmode': true
      };

      // send your mailgun instance the mailData
      mailgun.messages().send(mailData, function (err, body) {
        // If err console.log so we can debug
        if (err) {
          res.send('failed: ' + err);
        } else {        
          res.send(body)
        }      
      });
    };
};


// CSS Inliner Middleware
exports.mailInliner = function mailInliner (req, res, next) {
  var options = { url: './app/views/templates/email.' + req.body.template + '.template.html' },
      email = './app/views/templates/email.' + req.body.template + '.template.html';

  fs.readFile(email, function (err, data) {
    if (err) throw (err)
    // inline the css for the email template
    inlineCss(data, options)
      .then(function (html) {
        fs.writeFile('./app/views/templates/email.' + req.body.template + '.inlined.template.html', html, 'utf8', function (err) {
          if (err) {
            throw (err)
          }
          console.log('file changed and saved');        
          next();
        })        
      }) 
  })   
}

module.exports.mailSender = mailSender;
module.exports.mailCreator = mailCreator;
