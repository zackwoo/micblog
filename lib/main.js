#!/usr/bin/env node

/**
 * 程序入口
 */
var program = require('commander');
var _ = require('underscore');
var pack = require('../package.json');
var workDirectory = require('path').join(process.cwd(), '/blog'); //micblog生成地址

program
    .version(pack.version, "'-v, --version'");

program
    .command('create')
    .alias('init')
    .description('创建新micblog站点')
    .action(function () {
        require("./create.js").exec(workDirectory);
        this.parent.emit('build')
    });

program
    .command('build')
    .alias('b')
    .description('编译站点，生成html文件')
    .action(function () {
        require("./build.js").exec(workDirectory);
    });
program
    .command('test')
    .alias('t')
    .description('开始测试服务器')
    .action(function () {
        require("./serve.js").exec(["blog/release/", "8001"]);
    });
program
    .command('update')
    .alias('u')
    .description('更新micblog版本')
    .action(function () {
        require("./update.js").exec(workDirectory);
    });

program.parse(process.argv);
