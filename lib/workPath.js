/*
 *  提供执行目录
 */
var path = require('path');
var baseDirectory = path.join(process.cwd(), '/blog')
var configDirectory = path.join(baseDirectory, 'config');
var startupDirectory = path.join(__dirname, '../startup');

exports.join = path.join;
exports.extname = path.extname;

exports.rootDir = baseDirectory;
exports.startupDir = startupDirectory;
exports.releaseDir = path.join(baseDirectory, 'release');
exports.configFile = function (fileName) {
    return path.join(configDirectory, fileName);
}
