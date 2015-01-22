/**
 * 创建初始化新的micblog博客目录
 */

var _ = require('underscore');
var fs = require('fs-extra');
var wp = require('./workPath.js');
var logger = require('./log.js');

exports.exec = function (workDirectory) {
    if (!fs.existsSync(wp.startupDir)) {
        logger.error('未找到模板目录请卸载后重新再次安装micblog！');
        process.exit(1);
    }
    fs.copySync(wp.startupDir, wp.rootDir);
    logger.info("创建完成");
};
