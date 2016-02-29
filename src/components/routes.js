'use strict';
var path = require('path');
var router = require('koa-router')();
var body = require('koa-body')();
var glob = require('glob');

module.exports = exports = function (options) {
    var opt = Object.assign({}, options);
    var controllerFiles = glob.sync(path.join(opt.path, '**/*controller.js'), { nocase: true });

    controllerFiles.forEach((file) => {
        var controller = require(file);
        if (typeof controller.routes === 'function') {
            controller.routes().forEach((route) => {
                if (route.verb && route.path && route.action) {
                    if (!route.authenticate) {
                        router[route.verb]('/api' + route.path, body, route.action);
                    } else {
                        router[route.verb]('/api' + route.path, body, controller.authenticate, controller.authorize, route.action);
                    }
                }
            });
        }
    });

    router.get('/heartbeat', function* (next) { this.body = ''; });
    
    return router.routes();
};