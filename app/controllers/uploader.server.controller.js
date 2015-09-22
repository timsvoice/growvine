'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash'),
    awsKey = process.env.VERDANTREE_AWS_KEY,
    awsSecret = process.env.VERDANTREE_AWS_SECRET,
    awsBucket = 'verdantree',
    crypto = require('crypto'),
    moment = require('moment');

/**
 * Create a Uploader
 */
exports.sign = function(req, res) {
  var request = req.body;
  var fileName = request.filename;
  var path = request.organization + '/' + fileName;
  var readType = 'private';
  var expiration = moment().add(5, 'm').toDate(); //15 minutes
  var s3Policy = {
    'expiration': expiration,
    'conditions': [
      { 'bucket': awsBucket },
      [ 'starts-with', '$key', path ], 
      { 'acl': readType },
      { 'success_action_status': '201' },
      [ 'starts-with', '$Content-Type', 'image' ],
      [ 'content-length-range', 2048, 10485760 ], //min and max
    ]
  };
  var stringPolicy = JSON.stringify(s3Policy);
  var base64Policy = new Buffer(stringPolicy, 'utf-8').toString('base64');
  // sign policy
  var signature = crypto.createHmac('sha1', awsSecret)
    .update(new Buffer(base64Policy, 'utf-8')).digest('base64');

  var credentials = {
    url: 'https://s3-us-west-2.amazonaws.com/verdantree/',
    fields: {
        key: path,
        AWSAccessKeyId: awsKey,
        acl: readType,
        policy: base64Policy,
        signature: signature,
        'Content-Type': request.type,
        success_action_status: 201
    }
  };
  
  res.jsonp(credentials);
};