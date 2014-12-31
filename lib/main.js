#!/usr/bin/env node

/**
 * 程序入口
 */
var program = require('commander');
var _ = require('underscore');
var pack = require('../package.json');

program
    .version(pack.version);

program
    .command('create')
    .alias('c')
    .description('创建新micblog站点')
    .action(function (options) {
        require("./create.js").exec(_.defaults(options, ["blog"]));
    });

program
    .command('build')
    .alias('b')
    .description('编译站点，生成html文件')
    .action(function (options) {
        require("./build.js").exec(_.defaults(options, ["blog"]));
    });
program
    .command('test')
    .alias('t')
    .description('开始测试服务器')
    .action(function (options) {
        require("./serve.js").exec(_.defaults(options, ["blog/release/", "8001"]));
    });

program.parse(process.argv);
