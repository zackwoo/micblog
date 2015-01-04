//加载lib
var fs = require("fs");
var hbs = require("handlebars");

hbs.registerHelper('join', function (arg) {
    if (hbs.Utils.isArray(arg)) {
        return arg.join();
    }
    return arg.toString();
});

//构建模板
exports.exec = function (workDirectory) {
    //read partial
    var partialFiles = fs.readdirSync(workDirectory + '/templates/inc/');
    partialFiles.forEach(function (p) {
        var fullPath = workDirectory + '/templates/inc/' + p;
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
