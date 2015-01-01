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
var buildIndex = function (workDirectory) {
    var index = template["index"](context.site.setNavigationActive("主页"));
    fs.writeFile(workDirectory + '/release/index.html', index);
};
//创建文章
var buildArticles = function (workDirectory) {
    _.each(context.site.articles,function(item){
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
            var article = template["article"](context.getArticleContext(articleCfg.id,html));
            fs.writeFile(workDirectory + '/release/articles/' + articleCfg.id + ".html", article);
        });

    };
};
//创建标签页
var buildTag = function (workDirectory) {
        var tags = template["tags"](context.site.setNavigationActive("标签"));
        fs.writeFile(workDirectory + '/release/tags.html', tags);
    }
    //创建关于我
var buildAboutMe = function (workDirectory) {
    var about = template["about"](context.site.setNavigationActive("关于我"));
    fs.writeFile(workDirectory + '/release/about.html', about);
}

exports.exec = function (workDirectory) {

    if (!fs.existsSync(workDirectory)) {
        console.log("文件不存在，请重新执行create命令！！！");
        process.exit(1);
    }
    context.init(workDirectory);
    template = require("./compile.js").exec(workDirectory);
    buildIndex(workDirectory);
    buildArticles(workDirectory);
    buildTag(workDirectory);
    buildAboutMe(workDirectory);
};
