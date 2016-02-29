'use strict';
var toolkit = require('../index');

function* requestLog(next) {
    if (this.path.toLowerCase().substr(0, 10) === '/heartbeat') {
        yield next;
        return;
    }
    var start = new Date;
    yield next;
    var duration = new Date - start;
    if (this.response.status >= 500) {
        let details = {
            request: { params: this.params, body: this.request.body },
            response: { body: this.request.body }
        };
        toolkit.logger.error('%s %s - %sms %s', this.method, this.url, duration, this.response.status, details);
    } else {
        toolkit.logger.info('%s %s - %sms %s', this.method, this.url, duration, this.response.status);
    }
}

module.exports = exports = requestLog;