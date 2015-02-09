#!/usr/bin/env node

/**
 * 程序入口
 */
var program = require('commander');
var pack = require('../package.json');

/**
* 启动测试服务器
*/
function _startTestServer (){
    require("./serve.js").exec(["blog/release/", "8001"]);
}

program
    .version(pack.version);

program
    .command('create')
    .alias('init')
    .description('创建新micblog站点')
    .option('-t, --test','启动测试服务器')
    .action(function (options) {
        require("./create.js").exec();
        this.parent.emit('build');
        if (options.test) {
            _startTestServer();
        }
    });

program
    .command('build')
    .alias('b')
    .description('编译站点，生成html文件')
    .option('-t, --test','启动测试服务器')
    .action(function (options) {
        require("./build.js").exec();
        if (options.test) {
            _startTestServer();
        }
    });

program
    .command('update')
    .alias('u')
    .description('更新micblog版本')
    .option('-t, --test','启动测试服务器')
    .option('-b, --build','启动测试服务器')
    .action(function () {
        require("./update.js").exec();
        if (options.build) {
            this.parent.emit('build');
        }
        if (options.test) {
            _startTestServer();
        }
    });

program.parse(process.argv);
