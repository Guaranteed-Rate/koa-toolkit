'use strict';
var toolkit = require('../index');

function config(options) {
    var opt = Object.assign({}, options);
    var db = require('any-db');
    var pool = db.createPool(opt.url, opt.poolConfig);
    var db = {};
    db.execute = function(sql, params) {
        return function(callback) {
            pool.query(sql, params, (error, result) => {
                if (error) {
                    toolkit.logger.error('failed to execute sql command: ', { sql: sql, params: params, error: error, connection: opt.url });
                    callback(null, error);
                } else {
                    callback(null, result.rows);
                }
            });
        };
    }
    return db;
}

module.exports = exports = config;