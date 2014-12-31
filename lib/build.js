//加载编译模板
var fs = require("fs-extra");
var _ = require("underscore");
var hl = require('highlight.js');
var context = require('./context.js');
var marked = require('marked');
//设置语法高亮
marked.setOptions({
    highlight: function (code, lang) {
        return hl.highlightAuto(code).value;
    }
});

var template;

//创建首页
var buildIndex = function (root) {
    var index = template["index"](context.site.setNavigationActive("主页"));
    fs.writeFile(root + '/release/index.html', index);
};
//创建文章
var buildArticles = function (root) {
    _.each(context.site.articles,function(item){
        var fullPath = root + '/articles/' + item.id + ".md";
        fs.exists(fullPath, function (exists) {
            if (!exists) {
                fs.writeFile(fullPath, "未完待续", function () {
                    createArticles(fullPath, item, root);
                });
            } else {
                createArticles(fullPath, item, root);
            }
        });
    });


    var createArticles = function (mdFilePath, articleCfg, root) {
        fs.readFile(mdFilePath, 'utf-8', function (err, data) {
            var html = marked(data);
            var article = template["article"](context.getArticleContext(articleCfg.id,html));
            fs.writeFile(root + '/release/articles/' + articleCfg.id + ".html", article);
        });

    };
};
//创建标签页
var buildTag = function (root) {
        var tags = template["tags"](context.site.setNavigationActive("标签"));
        fs.writeFile(root + '/release/tags.html', tags);
    }
    //创建关于我
var buildAboutMe = function (root) {
    var about = template["about"](context.site.setNavigationActive("关于我"));
    fs.writeFile(root + '/release/about.html', about);
}

exports.exec = function (options) {
    var root;
    if (_.size(options) >= 1) {
        root = options[0];
    }

    if (!fs.existsSync(root)) {
        console.log("文件不存在，请重新执行create命令！！！");
        process.exit(1);
    }
    context.init(root);
    template = require("./compile.js").exec(root);
    buildIndex(root);
    buildArticles(root);
    buildTag(root);
    buildAboutMe(root);
};
