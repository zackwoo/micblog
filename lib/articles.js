/**
 *文章MD文件处理
 */
var hl = require('highlight.js');
var _ = require("underscore");
var fs = require("fs-extra");
var util = require('util');
var S = require('string');
var pinyin = require("pinyin");
var path = require('path');
var marked = require('marked');
var wp = require('./workPath.js');
//设置语法高亮
marked.setOptions({
    highlight: function(code, lang) {
        return hl.highlightAuto(code).value;
    }
});

var articlesCfgs = require(wp.configFile('articles.json'));
/**
 *将文件名转换成文件ID
 */
function _convertFileId(fileName) {
        //根据文件名生成id
        //中文转化为拼音
        var tmp = pinyin(fileName, {
            style: pinyin.STYLE_NORMAL
        });
        var cfgId = S(_.flatten(tmp).join('')).slugify().trim().s;
        if (_.isEmpty(cfgId)) {
            cfgId = fileName; //未知转换错误时返回文件原名称作为ID
        }
        return cfgId;
    }
    /**
     * 根据文件元属性提取配置信息
     */
function _getConfig(lines) {
        var config = {};
        _.each(lines, function(line) {
            var mts = _checkConfig(line);
            if (!mts) return;
            //匹配特殊标签类型
            if (mts[1] === "tags") {
                config[mts[1]] = mts[2].split(',');
            } else {
                config[mts[1]] = mts[2];
            }
        });
        return config; 
    }
    //根据文章第一行内容生成标题（格式：#标题）
function _getTitle(markdownFilePath, lines) {
    var mts = _checkTitle(lines[0]);
    if (mts) {
        return mts[1];
    }
    return path.basename(markdownFilePath, '.md');
}

function _checkTitle(str) {
    var pattern = /^#([^#].+)/;
    var mts = pattern.exec(str);
    return mts;
}

function _checkConfig(str) {
        var pattern = /^:(.*):(.*)/;
        var mts = pattern.exec(str);
        return mts;
    }
    //创建HTML内容
function _generateHTML(lines) {
    var content = "";
    _.each(lines, function(line, index) {
        if (index === 0 && _checkTitle(line)) return;
        if (_checkConfig(line)) return;
        content += line + "\r\n";
    });
    return marked(content);
}

var articleModel = function(markdownFilePath) {
    var fileName = path.basename(markdownFilePath, '.md');
    var stats = fs.statSync(markdownFilePath);
    var content = fs.readFileSync(markdownFilePath, 'utf-8');

    var lines = S(content).lines();
    var infostr = util.inspect(stats);
    var sindex = infostr.indexOf("ctime");
    var eindex = infostr.indexOf("}");
    var cfg = _.find(articlesCfgs, function(item) {
        return item.id.toLowerCase() === _convertFileId(fileName).toLowerCase();
    });
    if (cfg) {
        this.config = cfg;
    } else {
        this.config = {
            "id": _convertFileId(fileName),
            "title": _getTitle(markdownFilePath, lines),
            "createTime": Date.parse(infostr.substr(sindex + 6, eindex - sindex - 6)),
            "enabletoc": false,
            "tags": []
        };
        _.extend(this.config, _getConfig(lines));
    }
    this.HTML = _generateHTML(lines);
};

//根据路径返回articleModel实例
var articleHanlder = {
    init: function(markdownFilePath) {
        if (_.isEmpty(markdownFilePath)) throw Error('构建参数错误。');
        return new articleModel(markdownFilePath);
    }
};

module.exports = exports = articleHanlder;