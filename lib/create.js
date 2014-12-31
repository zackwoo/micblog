/**
 * 创建初始化博客目录
 */
/**
 * 生成一个新的papery站点
 */

var _ = require('underscore');
var fs = require('fs');
var fse = require('fs-extra');



exports.exec = function (options) {
    var root;
    if (_.size(options) >= 1) {
        root = options[0];
    } 
    var startup = __dirname + '/../startup';
    if (!fs.existsSync(startup)) {
        logger.error('Startup templates can not be found! Please reinstall your papery');
        process.exit(1);
    }

    var src = startup;
    var dest = root;
    fse.copySync(src, dest);
    console.log("创建完成");

};