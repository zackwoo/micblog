/**
 * 创建初始化博客目录
 */
/**
 * 生成一个新的papery站点
 */

var _ = require('underscore');
var fs = require('fs-extra');
var dirname = require('path').dirname;

exports.exec = function (workDirectory) {
    var startup = __dirname + '/../startup';
    if (!fs.existsSync(startup)) {
        console.error('Startup templates can not be found! Please reinstall your micblog');
        process.exit(1);
    }
    var src = startup;
    fs.copySync(src, workDirectory);
    console.log("创建完成");

};
