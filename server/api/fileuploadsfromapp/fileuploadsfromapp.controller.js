'use strict';

var _ = require('lodash');
var fs = require('fs');

var path = require('path');

exports.create = function(req, res) {
  console.log('upload from app');

  var moveDirectory = path.resolve(__dirname,'../../../tmp/');

  var file = req.files.file;
  var filePath = file.path;
  var lastIndex = filePath.lastIndexOf("/");
  var tmpFileName = filePath.substr(lastIndex + 1);
  var image = req.body;
  image.fileName = tmpFileName;

  fs.rename(filePath, moveDirectory + '/' + file.name,function(){
    console.log('file moved to ' + moveDirectory + '/' + file.name);
  });
  res.json(image);
};


function handleError(res, err) {
  return res.send(500, err);
}