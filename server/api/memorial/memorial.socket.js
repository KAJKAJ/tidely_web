/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Memorial = require('./memorial.model');

exports.register = function(socket) {
  Memorial.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Memorial.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('memorial:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('memorial:remove', doc);
}