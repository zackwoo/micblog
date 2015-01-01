/**
 * 创建初始化新的micblog博客目录
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
    fs.copySync(startup, workDirectory);
    console.log("创建完成");

};
