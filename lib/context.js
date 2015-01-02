//提供用于模板构建时的context
var fs = require("fs-extra");
var _ = require("underscore");


//读取配置
var siteCfg;
var articlesCfg;
var navigationCfg;
var pack = require('../package.json');

var defaultSiteCfg = {
    title: "micblog",
    author: "zachary",
    keywords: ["micblog", "zack"],
    description: "micblog静态博客系统",
    version: "1.0.0",
    copyright: {
        beginYear: 2014,
        endYear: 2015
    },
    tags: {},
    navigation: [],
    articles: [],
    article: {}
};

exports.init = function (workDirectory) {
    siteCfg = fs.readJsonSync(workDirectory + '/config/site.json');
    articlesCfg = fs.readJsonSync(workDirectory + '/config/articles.json');
    navigationCfg = fs.readJsonSync(workDirectory + '/config/navigation.json');

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
        navigation: navigationCfg
    }, {
        articles: articlesCfg
    });

}

exports.getArticleContext = function (articleId, articleContent) {
    var articleCfg = _.find(exports.site.articles, function (item) {
        return articleId === item.id;
    });
    _.extend(articleCfg, {
        content: articleContent
    });
    return _.extend({}, exports.site, {
        article: articleCfg
    });
}
