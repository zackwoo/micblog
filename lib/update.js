/**
 * 更新micblog
 */
var _ = require('underscore');
var fs = require('fs-extra');
var S = require('string');
var dirname = require('path').dirname;

var workDirectory;//工作目录

var updateFun = function (err, stdout, stderr) {
    if (err !== null) {
        throw err;
    }
    //update templates
    //no update plugin file
    var templatesDir = __dirname + '/../startup/templates';
    fs.copySync(templatesDir, workDirectory+'/templates',function(file){
        return !S(file).endsWith('_plugin.hbs');
    },_.noop);

    console.log('成功更新至最新版本');
}



exports.exec = function (workDir) {
    workDirectory = workDir;
    var exec = require('child_process').exec
    var child = exec('npm update -g micblog', updateFun);

};
