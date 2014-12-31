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

exports.init = function (root) {
    siteCfg = fs.readJsonSync(root + '/config/site.json');
    articlesCfg = fs.readJsonSync(root + '/config/articles.json');
    navigationCfg = fs.readJsonSync(root + '/config/navigation.json');

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
    }, {
        setNavigationActive: function (title) {
            _.each(this.navigation, function (item) {
                item.active = false;
            })
            var obj = _.find(this.navigation, function (item) {
                return item.title == title;
            });
            if(!_.isEmpty(obj)){
                obj.active = true;
            }
            return exports.site;
        }
    });

}



exports.getArticleContext = function (articleId, articleContent) {
    return _.extend({}, exports.site.setNavigationActive("文章"), {
        article: {
            content: articleContent
        }
    });
}
