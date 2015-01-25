/**
 * 更新micblog
 */
var _ = require('underscore');
var fs = require('fs-extra');
var S = require('string');
var compare = require('file-compare').compare;
var path = require('path');
var moment = require('moment');
var wp = require('./workPath.js');
var logger = require('./log.js');


/**
 *循环读取目录文件
 */
function loop(src, dest, callback) {
    var stats = fs.statSync(src);
    if (stats.isDirectory()) {
        var files = fs.readdirSync(src);
        _.each(files, function (item) {
            var name = path.basename(item);
            loop(path.join(src, name), path.join(dest, name), callback);
        });
    }
    if (stats.isFile()) {
        callback(src, dest);
    }
}

function updateFile(srcFile, destFile) {
    fs.exists(destFile, function (exists) {
        if (exists) {
            compare(srcFile, destFile, function (result) {
                if (!result) {
                    var ary = destFile.split(path.sep);
                    ary[ary.length - 1] = moment().format("YYMMDD") + path.basename(destFile);
                    fs.copy(srcFile, ary.join('/'), function (err) {
                        logger.warn('文件%s存在不同', path.basename(destFile));
                        logger.info('创建新文件 %s', ary.join('/'));
                    });
                }
            });
        } else {
            fs.copy(srcFile, destFile, function (err) {
                logger.info('新增文件%s', destFile);
            })
        }
    });

}



exports.exec = function () {
    loop(path.join(wp.startupDir, 'templates'), path.join(wp.rootDir, 'templates'), updateFile);
    loop(path.join(wp.startupDir, 'release'), path.join(wp.rootDir, 'release'), updateFile);
    loop(path.join(wp.startupDir, 'config'), path.join(wp.rootDir, 'config'), updateFile);
};
