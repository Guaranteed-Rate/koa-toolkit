'use strict';
var uuid = require('node-uuid')
var context = require('./context');

function* stitcher(next) {
    var sessionId = this.req.headers['x-session-id'] || uuid.v4();
    var requestId = uuid.v4();
    context.set('request-id', requestId);
    context.set('session-id', sessionId);

    yield next;

    this.set('X-Response-Id', requestId);
    this.set('X-Session-Id', sessionId);
}

module.exports = exports = stitcher;