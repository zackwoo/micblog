/**
 * 更新micblog
 */
var _ = require('underscore');
var fs = require('fs-extra');
var dirname = require('path').dirname;

var workDirectory;//工作目录

var updateFun = function (err, stdout, stderr) {
    if (err !== null) {
        throw err;
    }
    //update templates
    var templatesDir = __dirname + '/../startup/templates';
    fs.copySync(templatesDir, workDirectory+'/templates');

    console.log('更新成功当前版本为');
}



exports.exec = function (workDir) {
    workDirectory = workDir;
    var exec = require('child_process').exec
    var child = exec('npm update -g micblog', updateFun);

};
