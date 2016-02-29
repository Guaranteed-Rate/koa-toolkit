'use strict';
var winston = require('winston');
var context = require('./context');

function appendRequestId(level, message, meta) {
    var requestId = context.get('request-id');
    if (requestId) {
        meta._requestId = requestId;
    }
    return meta;
}

function appendSessionId(level, message, meta) {
    var sessionId = context.get('session-id');
    if (sessionId) {
        meta._sessionId = context.get('session-id');
    }
    return meta;
}

function config(options) {
    var opt = Object.assign({ transporters: [], logglySettings: {} }, options);
    var transporters = [];
    var singleLine = {
        timestamp: function () { return Date.now(); },
        formatter: function (entry) { return entry.timestamp() + ' ' + entry.level.toUpperCase() + ' ' + (undefined !== entry.message ? entry.message : '') + (entry.meta && Object.keys(entry.meta).length ? '\n\t' + JSON.stringify(entry.meta) : ''); }
    };

    if (opt.transporters.some((t) => { return t === 'console'; })) {
        transporters.push(new (winston.transports.Console)(singleLine));
    }
    if (opt.transporters.some((t) => { return t === 'file'; })) {
        var path = require('path');
        var DailyRotateFile = require('winston-daily-rotate-file');
        var mkdirp = require('mkdirp');
        mkdirp.sync(opt.filePath);
        transporters.push(new (DailyRotateFile)(Object.assign({ filename: path.join(opt.filePath, opt.filePrefix) }, singleLine)));
    }
    if (opt.transporters.some((t) => { return t === 'loggly'; })) {
        require('winston-loggly');
        transporters.push(new (winston.transports.Loggly)(opt.logglySettings));
    }

    return new (winston.Logger)({ transports: transporters, rewriters: [appendRequestId, appendSessionId] });
}

module.exports = exports = config;