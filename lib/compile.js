//加载lib
var fs = require("fs");
var hbs = require("handlebars");



//构建模板
exports.exec = function (root) {
    //read partial
    var partialFiles = fs.readdirSync(root+'/templates/inc/');
    partialFiles.forEach(function (p) {
        var fullPath = root + '/templates/inc/' + p;
        var stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
            //排除目录
            return;
        }
        hbs.registerPartial(p.split('.')[0], fs.readFileSync(fullPath, 'utf-8'));
        console.log('注册局部模板' + p);
    });

    //read template
    var template = {};
    var templateFiles = fs.readdirSync(root + '/templates/');
    templateFiles.forEach(function (t) {
        var fullPath = root + '/templates/' + t;
        var stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
            //排除目录
            return;
        }
        var fileName = t.split('.')[0];
        var c = fs.readFileSync(fullPath, 'utf-8');
        template[fileName] = hbs.compile(fs.readFileSync(root + '/templates/' + t, 'utf-8'));
        console.log('加载模板' + t);
    });
    return template;
}