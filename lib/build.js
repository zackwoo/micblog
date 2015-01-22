//加载编译模板
var fs = require("fs-extra");
var _ = require("underscore");
var hl = require('highlight.js');
var util = require('util');
var moment = require('moment');
var S = require('string');
var pinyin = require("pinyin");
var minify = require('html-minifier').minify;
var marked = require('marked');
var context = require('./context.js');
var wp = require('./workPath.js');
var logger = require('./log.js');


//设置语法高亮
marked.setOptions({
    highlight: function (code, lang) {
        return hl.highlightAuto(code).value;
    }
});
/**
 *压缩HTML
 */
function htmlMinify(html) {
    return minify(html, {
        removeComments: true,
        collapseWhitespace: true
    });
}

/**
 * 循环遍历文章Markdown文件,并自动生成配置项
 * @callbackFun
 *      文件名带扩展名
 *      文件名无扩展名
 *      文件配置项
 */
function eachMDfiles(callbackFun) {
    var articlesCfg = require(wp.configFile('articles.json'));
    var files = fs.readdirSync(wp.join(wp.rootDir, 'articles/'));
    _.each(files, function (t) {
        if (!S(t).endsWith("md")) return;
        var fullPath = wp.join(wp.rootDir, 'articles/', t);
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
            //根据文章第一行内容生成标题（格式：#标题）
            var pattern = /^#([^#].+)/;
            var data = fs.readFileSync(fullPath, 'utf-8');
            var mts = pattern.exec(data);
            if (mts) {
                cfg.title = mts[1];
            }
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
     */
var initArticlesCfg = function () {

    var filesCfg = []; //实际文件配置对象集合
    eachMDfiles(function (file, fileName, fileConfig) {
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

    fs.writeJsonSync(wp.configFile('articles.json'), sortCfg);
}

//创建首页
var buildIndex = function () {
    var index = template["index"](context.site);
    fs.writeFile(wp.join(wp.releaseDir, 'index.html'), htmlMinify(index), function (err) {
        if (err) throw err;
        logger.info("create index.html");
    });

};
//创建文章
var buildArticles = function () {
    var createArticles = function (mdFilePath, articleCfg) {
        fs.readFile(mdFilePath, 'utf-8', function (err, data) {
            var html = marked(data.replace(/^#([^#].+)/, "")); //去除内容首页带的标题，避免出现重复标题
            var article = template["article"](context.getArticleContext(articleCfg.id, html));
            fs.writeFile(wp.join(wp.releaseDir, 'articles/', articleCfg.id + ".html"), htmlMinify(article),function(err){
                if(err) throw err;
                logger.info("create %s.html", articleCfg.id);
            });

        });
    };
    eachMDfiles(function (file, fileName, fileConfig) {
        createArticles(wp.join(wp.rootDir, 'articles/', file), fileConfig);
    });
};
//创建标签页
var buildTag = function () {
    var tags = template["tags"](context.site);
    fs.writeFile(wp.join(wp.releaseDir, "tags.html"), htmlMinify(tags), function (err) {
        if (err) throw err;
        logger.info("create tag.html");
    });

}

exports.exec = function () {
    if (!fs.existsSync(wp.rootDir)) {
        logger.error("文件不存在，请重新执行create命令！！！");
        process.exit(1);
    }
    initArticlesCfg();
    context.init();
    template = require("./compile.js").exec();
    buildIndex();
    buildArticles();
    buildTag();
};
