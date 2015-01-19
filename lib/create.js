/**
 * 创建初始化新的micblog博客目录
 */

var _ = require('underscore');
var fs = require('fs-extra');
var wp = require('./workPath.js');

exports.exec = function (workDirectory) {
    if (!fs.existsSync(wp.startupDir)) {
        console.error('Startup templates can not be found! Please reinstall your micblog');
        process.exit(1);
    }
    fs.copySync(wp.startupDir, wp.rootDir);
    console.log("创建完成");
};
