'use strict';

var _ = require('lodash');

var  path = require('path');
var flow = require('./flow.node');

// Get list of fileuploads
exports.index = function(req, res) {
  Fileupload.find(function (err, fileuploads) {
    if(err) { return handleError(res, err); }
    return res.json(200, fileuploads);
  });
};

// Get a single fileupload
exports.show = function(req, res) {
  Fileupload.findById(req.params.id, function (err, fileupload) {
    if(err) { return handleError(res, err); }
    if(!fileupload) { return res.send(404); }
    return res.json(fileupload);
  });
};

// Creates a new fileupload in the DB.
exports.create = function(req, res) {

 flow.post(req, function(status, filename, original_filename, identifier) {
  console.log('POST', status, original_filename, identifier);
  res.send(200, {});
 });

  // Fileupload.create(req.body, function(err, fileupload) {
  //   if(err) { return handleError(res, err); }
  //   return res.json(201, fileupload);
  // });
};

// Updates an existing fileupload in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Fileupload.findById(req.params.id, function (err, fileupload) {
    if (err) { return handleError(err); }
    if(!fileupload) { return res.send(404); }
    var updated = _.merge(fileupload, req.body);
    updated.save(function (err) {
      if (err) { return handleError(err); }
      return res.json(200, fileupload);
    });
  });
};

// Deletes a fileupload from the DB.
exports.destroy = function(req, res) {
  Fileupload.findById(req.params.id, function (err, fileupload) {
    if(err) { return handleError(res, err); }
    if(!fileupload) { return res.send(404); }
    fileupload.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}