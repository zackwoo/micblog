#!/usr/bin/env node

/**
 * 程序入口
 */
var program = require('commander');
var _ = require('underscore');
var pack = require('../package.json');
var workDirectory = require('path').join(process.cwd(),'/blog');//micblog生成地址

program
    .version(pack.version);

program
    .command('create')
    .alias('c')
    .description('创建新micblog站点')
    .action(function () {
        require("./create.js").exec(workDirectory);
    });

program
    .command('build')
    .alias('b')
    .description('编译站点，生成html文件')
    .action(function (options) {
        require("./build.js").exec(workDirectory);
    });
program
    .command('test')
    .alias('t')
    .description('开始测试服务器')
    .action(function (options) {
        require("./serve.js").exec(_.defaults(options, ["blog/release/", "8001"]));
    });
program
    .command('update')
    .alias('u')
    .description('更新micblog版本')
    .action(function (options) {
        var exec = require('child_process').exec
        var child = exec('npm update -g micblog',
            function (err, stdout, stderr) {
                if (err !== null) {
                    throw err;
                }
                console.log('更新成功当前版本为');
            });
    });

program.parse(process.argv);
