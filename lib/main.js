#!/usr/bin/env node

/**
 * 程序入口
 */
var program = require('commander');
var _ = require('underscore');
var pack = require('../package.json');
var wp = require('./workPath.js');

program
    .version(pack.version);

program
    .command('create')
    .alias('init')
    .description('创建新micblog站点')
    .action(function () {
        require("./create.js").exec();
        this.parent.emit('build')
    });

program
    .command('build')
    .alias('b')
    .description('编译站点，生成html文件')
    .action(function () {
        require("./build.js").exec();
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
        require("./update.js").exec(wp.rootDir);
    });

program.parse(process.argv);
