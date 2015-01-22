/**
 * 更新micblog
 */
var _ = require('underscore');
var fs = require('fs-extra');
var S = require('string');
var dirname = require('path').dirname;
var wp = require('./workPath.js');
var logger = require('./log.js');
var updateFun = function (err, stdout, stderr) {
    if (err !== null) {
        throw err;
    }
    //update templates
    //no update plugin file
    var templatesDir =wp.join( __dirname , '/../startup/templates');
    fs.copySync(templatesDir,wp.join(wp.rootDir,'/templates'),function(file){
        return !S(file).endsWith('_plugin.hbs');
    },_.noop);

    logger.info('成功更新至最新版本');
}



exports.exec = function () {
    var exec = require('child_process').exec
    var child = exec('npm update -g micblog', updateFun);

};
