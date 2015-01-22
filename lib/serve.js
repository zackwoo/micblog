/**
 * 在本地启动一个调试服务器
 */
var connect = require('connect');
var serveStatic = require('serve-static');
var _ = require('underscore');
var logger = require('./log.js');

exports.exec = function (options) {
    var port;
    var root;
    if (_.size(options) >= 2) {
        root = options[0];
        port = parseInt(options[1], 10);
    } else if (_.size(options) === 1) {
        root = options[0];
    } 
    logger.info("root is %s",root);

    var serve = serveStatic(root, {
        'index': ['index.html']
    })
    var app = connect();
    app.use(serve);
    app.listen(port);
    logger.info('Server started at http://localhost:%s',port);
}
