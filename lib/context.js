//提供用于模板构建时的context
var fs = require("fs-extra");
var _ = require("underscore");
var moment = require('moment');

//读取配置
var siteCfg;
var articlesCfg;
var pack = require('../package.json');

var defaultSiteCfg = {
    title: "",
    site_title: "",
    author: "zachary",
    keywords: ["micblog", "zack"],
    description: "micblog静态博客系统",
    version: "1.0.0",
    copyright: {
        beginYear: 2014,
        endYear: 2015
    },
    scope:"page",//article，page or all
    tags: {},
    navigation: [],
    articles: [],
    article: {}
};

exports.init = function (workDirectory) {
    siteCfg = fs.readJsonSync(workDirectory + '/config/site.json');
    if (_.isEmpty(siteCfg.title)) {
        siteCfg.title = siteCfg.site_title;
    }
    articlesCfg = fs.readJsonSync(workDirectory + '/config/articles.json');

    _.each(articlesCfg, function (item) {
        //format createtime
        item.createTime = moment(item.createTime).format('YYYY年MM月DD日');
    });
    //创建tags对象
    var tags = {};
    _.each(articlesCfg, function (item) {
        _.each(item.tags, function (tag) {
            if (_.has(tags, tag)) {
                tags[tag].push(item);
            } else {
                tags[tag] = [item];
            }
        })
    });

    exports.site = _.extend({}, defaultSiteCfg, {
        version: pack.version
    }, siteCfg, {
        tags: tags
    }, {
        articles: articlesCfg
    });

}

exports.getArticleContext = function (articleId, articleContent) {
    var articleCfg = _.find(exports.site.articles, function (item) {
        return articleId === item.id;
    });
    var idAry = _.map(exports.site.articles, function (item) {
        return item.id
    });
    var currentIndex = _.indexOf(idAry, articleId);
    if (currentIndex > 0) {
        articleCfg.prev = exports.site.articles[currentIndex - 1];
    }
    if (currentIndex < exports.site.articles.length - 1) {
        articleCfg.next = exports.site.articles[currentIndex + 1];
    }
    _.extend(articleCfg, {
        content: articleContent
    });
    var context = _.extend({}, exports.site, {
        article: articleCfg
    });
    //将文章tags加入到keywords
    context.keywords = _.union(context.keywords, articleCfg.tags);
    context.title = articleCfg.title + ' | ' + context.title;
    context.scope = "article";
    return context;
}
