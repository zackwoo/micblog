//加载lib
var fs = require("fs-extra");
var hbs = require("handlebars");
var _ = require("underscore");

hbs.registerHelper('join', function (arg) {
    if (hbs.Utils.isArray(arg)) {
        return arg.join();
    }
    return arg.toString();
});

hbs.registerHelper('plugin_stylesheet', function (scope) {
    var workDirectory = require('path').join(process.cwd(), '/blog')
    var pluginCfg = fs.readJsonSync(workDirectory + '/config/plugin.json');
    var list = null,
        stylesheet="";

    if (scope.toLocaleLowerCase()==="article") {
        //加载文章样式
        list = _.filter(pluginCfg,function(item){
            return _.isString(item.scope) && item.scope.toLocaleLowerCase() === "article";
        });
    }else if(scope.toLowerCase()==="page"){
        //独立页面样式
        list = _.filter(pluginCfg,function(item){
            return _.isString(item.scope) && item.scope.toLocaleLowerCase() === "page";
        });
    }else{
        //加载所有样式
        list = pluginCfg;
    }
    _.each(list,function(item){
        if(_.isString(item.stylesheet)){
            stylesheet+='<link rel="stylesheet" href="'+item.stylesheet+'">';
        }
        else if(_.isArray(item.stylesheet)){
            _.each(item.stylesheet,function(src){
                stylesheet+='<link rel="stylesheet" href="'+src+'">';
            })
        }
    })
    return new hbs.SafeString(stylesheet);
});

hbs.registerHelper('plugin_javascript', function (scope) {
    var workDirectory = require('path').join(process.cwd(), '/blog')
    var pluginCfg = fs.readJsonSync(workDirectory + '/config/plugin.json');
    var list = null,
        javascript="";

    if (scope.toLocaleLowerCase()==="article") {
        //加载文章样式
        list = _.filter(pluginCfg,function(item){
            return _.isString(item.scope) && item.scope.toLocaleLowerCase() === "article";
        });
    }else if(scope.toLowerCase()==="page"){
        //独立页面样式
        list = _.filter(pluginCfg,function(item){
            return _.isString(item.scope) && item.scope.toLocaleLowerCase() === "page";
        });
    }else{
        //加载所有样式
        list = pluginCfg;
    }
    _.each(list,function(item){
        if(_.isString(item.javascript)){
            javascript+='<script src="'+item.javascript+'"></script>';
        }
        else if(_.isArray(item.javascript)){
            _.each(item.javascript,function(src){
                javascript+='<script src="'+src+'"></script>';
            })
        }
    })
    return new hbs.SafeString(javascript);
});

function registerPartial (dirPath){
    var partialFiles = fs.readdirSync(dirPath);
    partialFiles.forEach(function (p) {
        var fullPath = dirPath + p;
        var stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
            //排除目录
            return;
        }
        if(p.split('.')[1]!='hbs'){
            //排除非hbs文件模板
            return;
        }
        hbs.registerPartial(p.split('.')[0], fs.readFileSync(fullPath, 'utf-8'));
    });
}

//构建模板
exports.exec = function (workDirectory) {
    //read partial
    registerPartial(workDirectory + '/templates/inc/');
    //注册插件
    registerPartial(workDirectory + '/templates/plugin/');

    //read template
    var template = {};
    var templateFiles = fs.readdirSync(workDirectory + '/templates/');
    templateFiles.forEach(function (t) {
        var fullPath = workDirectory + '/templates/' + t;
        var stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
            //排除目录
            return;
        }
        var fileName = t.split('.')[0];
        var c = fs.readFileSync(fullPath, 'utf-8');
        template[fileName] = hbs.compile(fs.readFileSync(workDirectory + '/templates/' + t, 'utf-8'));
        console.log('加载模板' + t);
    });
    return template;
}
