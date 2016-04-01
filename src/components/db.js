'use strict';
var db = require('any-db');
var toolkit = require('../index');

function config(options) {
    var opt = Object.assign({}, options);
    var pool = db.createPool(opt.url, opt.poolConfig);
    var db = {};
    db.execute = function(sql, params) {
        return function(callback) {
            pool.query(sql, params, (error, result) => {
                if (error) {
                    toolkit.logger.error('failed to execute sql command: ', { sql: sql, params: params, error: error, connection: settings.database });
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