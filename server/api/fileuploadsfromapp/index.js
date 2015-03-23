'use strict';

var express = require('express');
var controller = require('./fileuploadsfromapp.controller');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var router = express.Router();

router.post('/', multipartMiddleware, controller.create);

module.exports = router;