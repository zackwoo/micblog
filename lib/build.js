//加载编译模板
var fs = require("fs-extra");
var _ = require("underscore");
var hl = require('highlight.js');
var context = require('./context.js');
var util = require('util');
var moment = require('moment');
var S = require('string');
var pinyin = require("pinyin");

var marked = require('marked');
//设置语法高亮
marked.setOptions({
    highlight: function (code, lang) {
        return hl.highlightAuto(code).value;
    }
});

/**
 * 循环遍历文章Markdown文件
 * @callbackFun
 *      文件名带扩展名
 *      文件名无扩展名
 *      文件配置项
 */
function eachMDfiles(workDirectory, callbackFun) {
    var articlesCfg = require(workDirectory + '/config/articles.json');
    var files = fs.readdirSync(workDirectory + '/articles/');
    _.each(files, function (t) {
        if (!S(t).endsWith("md")) return;
        var fullPath = workDirectory + '/articles/' + t;
        var stats = fs.statSync(fullPath);
        if (!stats.isFile()) return;

        var fileName = t.split('.')[0];
        var idAry = _.map(articlesCfg, function (item) {
            return S(item.id).slugify().s;
        });
        var cfg = null;
        if (!_.contains(idAry, convertFileId(fileName))) {
            //未配置
            var infostr = util.inspect(stats);
            var sindex = infostr.indexOf("ctime");
            var eindex = infostr.indexOf("}");
            cfg = {
                "id": convertFileId(fileName),
                "title": fileName,
                "createTime": Date.parse(infostr.substr(sindex + 6, eindex - sindex - 6)),
                "enabletoc": false,
                "tags": []
            };
        } else {
            cfg = _.find(articlesCfg, function (item) {
                return S(item.id).slugify().s == convertFileId(fileName);
            });
            cfg.createTime = moment(cfg.createTime);
        }
        callbackFun(t, fileName, cfg);
    });
}

var template;
/**
 *将文件名转换成文件ID
 */
var convertFileId = function (fileName) {
        //根据文件名生成id
        //中文转化为拼音
        var tmp = pinyin(fileName, {
            style: pinyin.STYLE_NORMAL
        });
        var cfgId = S(_.flatten(tmp).join('')).slugify().trim().s;
        if (_.isEmpty(cfgId)) {
            cfgId = fileName; //未知转换错误时返回文件原名称作为ID
        }
        return cfgId;
    }
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
     *      1.默认获取title的方式
     */
var initArticlesCfg = function (workDirectory) {

    var filesCfg = []; //实际文件配置对象集合
    eachMDfiles(workDirectory, function (file, fileName, fileConfig) {
        filesCfg.push(fileConfig);
    });
    var sortCfg = _.sortBy(filesCfg, function (item) {
        if (item.top) {
            var topOrder = item.top * 1;
            if (isNaN(topOrder)) topOrder = 0;
            return topOrder;
        }
        return moment('2100-12-31') - item.createTime;
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
    var createArticles = function (mdFilePath, articleCfg, workDirectory) {
        fs.readFile(mdFilePath, 'utf-8', function (err, data) {
            var html = marked(data);
            var article = template["article"](context.getArticleContext(articleCfg.id, html));
            fs.writeFile(workDirectory + '/release/articles/' + articleCfg.id + ".html", article);
        });
    };
    eachMDfiles(workDirectory, function (file, fileName, fileConfig) {
        createArticles(workDirectory + '/articles/' + file, fileConfig, workDirectory);
    });
};
//创建标签页
var buildTag = function (workDirectory) {
    var tags = template["tags"](context.site);
    fs.writeFile(workDirectory + '/release/tags.html', tags);
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
};
