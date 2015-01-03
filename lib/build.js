//加载编译模板
var fs = require("fs-extra");
var _ = require("underscore");
var hl = require('highlight.js');
var context = require('./context.js');
var util = require('util');
var moment = require('moment');
var S = require('string');

var marked = require('marked');
//设置语法高亮
marked.setOptions({
    highlight: function (code, lang) {
        return hl.highlightAuto(code).value;
    }
});

var template;

/**
 * 初始化文章配置
 * 查找articles目录中*.md文件
 * 如果articles.json中已经配置了对应文章则跳过，否则根据默认约束自动生成articles.json
 * 默认约束：
 *       *.md第一行为#打头的一级标题，则将该标题设置为title，如果没有则用文件名称作为title
 *       文件的创建时间设置为createtime属性
 *       tags 为空
 *       enabletoc为false
 *       id自动生成
 * TODO:
 *      1.md文件被删除自动删除cfg对象
 *      2.默认获取title的方式
 */
var initArticlesCfg = function (workDirectory) {

    var articlesCfg = require(workDirectory + '/config/articles.json');

    var files = fs.readdirSync(workDirectory + '/articles/');
    var filesCfg = []; //实际文件配置对象集合
    _.each(files, function (t) {
        if (!S(t).endsWith("md")) return;
        var fullPath = workDirectory + '/articles/' + t;
        var stats = fs.statSync(fullPath);
        if (!stats.isFile()) return;

        var fileName = t.split('.')[0];
        var idAry = _.map(articlesCfg, function (item) {
            return item.id
        });
        var cfg = null;
        if (!_.contains(idAry, fileName)) {
            //未配置
            var infostr = util.inspect(stats);
            var sindex = infostr.indexOf("ctime");
            var eindex = infostr.indexOf("}");
            cfg = {
                "id": fileName,
                "title": fileName,
                "createTime": Date.parse(infostr.substr(sindex + 6, eindex - sindex - 6)),
                "enabletoc": false,
                "tags": []
            };
        } else {
            cfg = _.find(articlesCfg, function (item) {
                return item.id == fileName
            });
            cfg.createTime = moment(cfg.createTime);
        }
        filesCfg.push(cfg);
    });
    var sortCfg = _.sortBy(filesCfg,function(item){
        return item.createTime*-1;
    });
    fs.writeJsonSync(workDirectory + '/config/articles.json', sortCfg);
}

//创建首页
var buildIndex = function (workDirectory) {
    var index = template["index"](context.site);
    fs.writeFile(workDirectory + '/release/index.html', index);
};
//创建文章
var buildArticles = function (workDirectory) {
    _.each(context.site.articles, function (item) {
        var fullPath = workDirectory + '/articles/' + item.id + ".md";
        fs.exists(fullPath, function (exists) {
            if (!exists) {
                fs.writeFile(fullPath, "未完待续", function () {
                    createArticles(fullPath, item, workDirectory);
                });
            } else {
                createArticles(fullPath, item, workDirectory);
            }
        });
    });


    var createArticles = function (mdFilePath, articleCfg, workDirectory) {
        fs.readFile(mdFilePath, 'utf-8', function (err, data) {
            var html = marked(data);
            var article = template["article"](context.getArticleContext(articleCfg.id, html));
            fs.writeFile(workDirectory + '/release/articles/' + articleCfg.id + ".html", article);
        });

    };
};
//创建标签页
var buildTag = function (workDirectory) {
        var tags = template["tags"](context.site);
        fs.writeFile(workDirectory + '/release/tags.html', tags);
    }
    //创建关于我
var buildAboutMe = function (workDirectory) {
    var about = template["about"](context.site);
    fs.writeFile(workDirectory + '/release/about.html', about);
}

exports.exec = function (workDirectory) {

    if (!fs.existsSync(workDirectory)) {
        console.log("文件不存在，请重新执行create命令！！！");
        process.exit(1);
    }
    initArticlesCfg(workDirectory);
    context.init(workDirectory);
    template = require("./compile.js").exec(workDirectory);
    buildIndex(workDirectory);
    buildArticles(workDirectory);
    buildTag(workDirectory);
    buildAboutMe(workDirectory);
};
