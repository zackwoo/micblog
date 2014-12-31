/*
micblog 单元测试
*/
var fs = require('fs-extra');
var should = require('chai').should();
var ex = fs.existsSync

describe('create', function () {
    it('当前目录不应该包含blog文件夹', function () {
        ex('test/blog').should.to.not.be.true
    });
    it('创建新micblog站点', function () {
        require('../lib/create.js').exec(['test/blog']);
        ex('test/blog/articles').should.to.be.true;
        ex('test/blog/config').should.to.be.true;
        ex('test/blog/release').should.to.be.true;
        ex('test/blog/templates').should.to.be.true;
    });
    before(function(){
        fs.removeSync('test/blog/');
    });
});

describe('build', function () {
    before(function(){
        fs.removeSync('test/blog/');
        require('../lib/create.js').exec(['test/blog']);
    });
    it('构建博客站点内容', function (done) {
        //测试的代码在此
        require('../lib/build.js').exec(['test/blog']);
        ex('test/blog/release/index.html').should.to.be.true;
        done();
    });
});
