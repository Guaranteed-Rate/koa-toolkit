'use strict';
const path = require('path');
const router = require('koa-router')();
const body = require('koa-body')();
const glob = require('glob');
const send = require('koa-send');

function* spa(next) {
    if (this.path.substr(0, 5).toLowerCase() === '/api/' || this.path.substr(0, 10).toLowerCase() === '/heartbeat') {
        yield next;
        return;
    }
    else if (yield send(this, this.path, { root: path.join(settings.root, '/../client') })) {
        return;
    } else if (this.path.indexOf('.') !== -1) {
        return;
    } else {
        yield send(this, '/index.html', { root: path.join(settings.root, '/../client') });
    }
}

function routes(options, app) {
    let opt = Object.assign({}, options);
    let controllerFiles = glob.sync(path.join(opt.path, '**/*controller.js'), { nocase: true });

    controllerFiles.forEach((file) => {
        const controller = require(file);
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

    if (options.spaPath) {
        app.use(function* (next) {
            if (this.path.substr(0, 5).toLowerCase() === '/api/' || this.path.substr(0, 10).toLowerCase() === '/heartbeat') {
                yield next;
                return;
            }
            else if (yield send(this, this.path, { root: opt.spaPath })) {
                return;
            } else if (this.path.indexOf('.') !== -1) {
                return;
            } else {
                yield send(this, '/index.html', { root: opt.spaPath });
            }
        });
    }

    return router.routes();
};

module.exports = exports = routes;