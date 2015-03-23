/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/fileuploads', require('./api/fileupload'));
  app.use('/api/fileuploadsfromapp', require('./api/fileuploadsfromapp'));

  // app.use('/api/memorials', require('./api/memorial'));
  // app.use('/api/things', require('./api/thing'));
  // app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));
  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // routing for static file
  app.route('/tmp/*')
    .get(function(req, res) {
      var path = req.params[0];
      res.sendfile(path, {root: "./tmp"});
  });

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
