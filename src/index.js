'use strict';
let toolkit = {};

function start(options) {
    const app = require('koa')();
    const context = require('./components/context')();
    const stitcher = require('./components/stitcher');
    const opt = Object.assign({}, options);
    const routes = require('./components/routes')(options.routes, app);
    const cors = require('kcors');
    
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
    if (opt.db) {
        toolkit.db = require('./components/db')(opt.db);
    }    

    const server = app.listen(opt.port);

    process.on('SIGTERM', () => { server.close(() => { process.exit(0); }); });

    console.log('listening on port ' + options.port)
}

toolkit.start = start;

module.exports = exports = toolkit;