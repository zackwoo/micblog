var fs = require('fs-extra');
var should = require('chai').should();

fs.readFile('micblogDeploy.md','utf-8', function (err, data) {
    if (err) throw err;
    var separator = '\r\n';
    var separatorIndex = data.indexOf(separator);

    console.log(data.substr(separatorIndex,data.indexOf(separator,separatorIndex)));
});
