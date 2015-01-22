//加载lib
var fs = require("fs-extra");
var hbs = require("handlebars");
var _ = require("underscore");
var wp = require('./workPath.js');

var _createPluginScript = function (scope, itemName) {
    var pluginCfg = fs.readJsonSync(wp.configFile('plugin.json'));
    var list = null,
        html = "";

    if (scope.toLocaleLowerCase() === "article") {
        //加载文章样式
        list = _.filter(pluginCfg, function (item) {
            return _.isString(item.scope) && (item.scope.toLocaleLowerCase() === "article" || item.scope.toLocaleLowerCase() === "all");
        });
    } else if (scope.toLowerCase() === "page") {
        //独立页面样式
        list = _.filter(pluginCfg, function (item) {
            return _.isString(item.scope) && (item.scope.toLocaleLowerCase() === "page" || item.scope.toLocaleLowerCase() === "all");
        });
    }
    _.each(list, function (item) {
        if (itemName === "stylesheet") {
            if (_.isString(item[itemName])) {
                html += '<link rel="stylesheet" href="' + item[itemName] + '">';
            } else if (_.isArray(item[itemName])) {
                _.each(item[itemName], function (src) {
                    html += '<link rel="stylesheet" href="' + src + '">';
                })
            }
        }else if (itemName === "javascript") {
            if (_.isString(item[itemName])) {
                html +='<script src="' + item[itemName] + '"></script>';
            } else if (_.isArray(item[itemName])) {
                _.each(item[itemName], function (src) {
                    html += '<script src="' + src + '"></script>';
                })
            }
        }

    })
    return new hbs.SafeString(html);
};

hbs.registerHelper('join', function (arg) {
    if (hbs.Utils.isArray(arg)) {
        return arg.join();
    }
    return arg.toString();
});

hbs.registerHelper('plugin_stylesheet', function (scope) {
    return _createPluginScript(scope, "stylesheet");
});

hbs.registerHelper('plugin_javascript', function (scope) {
    return _createPluginScript(scope, "javascript");
});

function registerPartial(dirPath) {
    var partialFiles = fs.readdirSync(dirPath);
    partialFiles.forEach(function (p) {
        var fullPath = dirPath + p;
        var stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
            //排除目录
            return;
        }
        if (wp.extname(p) != '.hbs') {
            //排除非hbs文件模板
            return;
        }
        hbs.registerPartial(p.split('.')[0], fs.readFileSync(fullPath, 'utf-8'));
    });
}

//构建模板
exports.exec = function () {
    //read partial
    registerPartial(wp.join(wp.rootDir, '/templates/inc/'));
    //注册插件
    registerPartial(wp.join(wp.rootDir, '/templates/plugin/'));

    //read template
    var template = {};
    var templateFiles = fs.readdirSync(wp.join(wp.rootDir, '/templates/'));
    templateFiles.forEach(function (t) {
        var fullPath = wp.join(wp.rootDir, '/templates/', t);
        var stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
            //排除目录
            return;
        }
        var fileName = t.split('.')[0];
        var c = fs.readFileSync(fullPath, 'utf-8');
        template[fileName] = hbs.compile(fs.readFileSync(wp.join(wp.rootDir, '/templates/', t), 'utf-8'));
    });
    return template;
}
