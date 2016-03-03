'use strict';
var toolkit = {};

function start(options) {
    var app = require('koa')();
    var context = require('./components/context')();
    var stitcher = require('./components/stitcher');
    var opt = Object.assign({}, options);
    var routes = require('./components/routes')(options.routes);
    var cors = require('kcors');
    
    app.use(cors());
    app.use(context);
    app.use(stitcher);
    if (opt.metrics) {
        let requestMetrics = require('./components/request.metrics')(opt.metrics);
        app.use(requestMetrics);        
    }
    if (opt.log) {
        let requestLog = require('./components/request.log');
        toolkit.logger = require('./components/logger')(opt.log);
        app.use(requestLog);
    }
    app.use(routes);
    
    toolkit.context = context;
    toolkit.request = require('./components/request');

    var server = app.listen(opt.port);

    process.on('SIGTERM', () => { server.close(() => { process.exit(0); }); });

    console.log('listening on port ' + options.port)
}

toolkit.start = start;

module.exports = exports = toolkit;