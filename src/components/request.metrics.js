'use strict';
var StatsD = require('node-dogstatsd').StatsD;
var toolkit = require('../index');

module.exports = exports = function (options) {
    var opt = Object.assign({}, options);
    var metric = new StatsD(opt.host, opt.port)

    var metricsRequest = function* (next) {
        var path = this.path.toLowerCase();
        if (path.substr(0, 5) !== '/api/' && path.substr(0, 10) !== '/heartbeat') {
            yield next;
            return;
        }
        var start = new Date;
        yield next;
        try {
            let duration = new Date - start;
            let name = path.replace(/\//g, '.') + '.' + this.request.method.toLowerCase();
            let status = Math.floor(this.response.status / 100) * 100;
            metric.timing(opt.prefix + name + '.time', duration);
            metric.increment(opt.prefix + name + '.status.' + status);
            metric.timing(opt.prefix + '.api.time', duration);
            metric.increment(opt.prefix + '.api.status.' + status);
        } catch (ex) {
            if (toolkit.logger) {
                toolkit.logger.error(ex);
            }
        }
    };
    return metricsRequest;
}