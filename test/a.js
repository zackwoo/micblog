var fs = require('fs-extra');
var should = require('chai').should();

fs.readFile('micblogDeploy.md', 'utf-8', function (err, data) {
    if (err) throw err;

    console.log(data.replace(/^#([^#].+)/, ""));
});
