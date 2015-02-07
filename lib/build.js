//加载编译模板
var fs = require("fs-extra");
var _ = require("underscore");
var moment = require('moment');
var S = require('string');
var minify = require('html-minifier').minify;
var context = require('./context.js');
var wp = require('./workPath.js');
var logger = require('./log.js');
var articleHanlder = require('./articles.js');
 
var template,
    articleModels = [];
/**
 *压缩HTML
 */
function _htmlMinify(html) {
        return minify(html, {
            removeComments: true,
            collapseWhitespace: true
        });
    }
    /**
     * 循环遍历文章Markdown文件,并自动生成article对象
     */
function _initArticleModel() {
        var files = fs.readdirSync(wp.join(wp.rootDir, 'articles/'));
        _.each(files, function(t) {
            if (!S(t).endsWith("md")) return;
            var fullPath = wp.join(wp.rootDir, 'articles/', t);
            var stats = fs.statSync(fullPath);
            if (!stats.isFile()) return;
            articleModels.push(articleHanlder.init(fullPath));
        });
    }
    /**
     * 初始化文章配置
     * 查找articles目录中*.md文件
     * 如果articles.json中已经配置了对应文章则跳过，否则根据默认约束自动生成articles.json
     * 默认约束：
     *       *.md第一行为#打头的一级标题，则将该标题设置为title，如果没有则用文件名称作为title
     *       文件的创建时间设置为createtime属性
     *       id自动生成
     *       所有属性或额外属性可用
     *       :属性:内容
     */
function _initArticlesCfg() {
    var cfgs = _.map(articleModels, function(item) {
        return item.config;
    });
    var sortCfg = _.sortBy(cfgs, function(item) {
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
var buildIndex = function() {
    var index = template["index"](context.site);
    fs.writeFile(wp.join(wp.releaseDir, 'index.html'), _htmlMinify(index), function(err) {
        if (err) throw err;
        logger.info("create index.html");
    });

};
//创建文章
var buildArticles = function() {    
    _.each(articleModels, function(item) {
        var article = template["article"](context.getArticleContext(item.config.id, item.HTML));
        var filePath = S('articles/{{name}}.html').template({
            name: item.config.id
        }).s;
        fs.writeFile(wp.join(wp.releaseDir, filePath), _htmlMinify(article), function(err) {
            if (err) throw err;
            logger.info("create %s.html", item.config.id);
        });
    });
};
//创建标签页
var buildTag = function() {
    var tags = template["tags"](context.site);
    fs.writeFile(wp.join(wp.releaseDir, "tags.html"), _htmlMinify(tags), function(err) {
        if (err) throw err;
        logger.info("create tag.html");
    });
};

exports.exec = function() {
    if (!fs.existsSync(wp.rootDir)) {
        logger.error("文件不存在，请重新执行create命令！！！");
        process.exit(1);
    }
    _initArticleModel();
    _initArticlesCfg();
    context.init();
    template = require("./compile.js").exec();
    buildIndex();
    buildArticles();
    buildTag();
};