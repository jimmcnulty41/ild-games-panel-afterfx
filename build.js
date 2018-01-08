var copy = require('copyfiles');
var fs = require('fs');
var pathService = require("path");

const ignore = [
    'node_modules',
    '.git',
    '.test'
];

function getJsFilesInPath(path) {
    var files = fs.readdirSync(path);
    var jsFilesFound = [];
    while (files.length > 0) {
        var fullPath = pathService.join(path, files[0]);
        if (pathService.extname(files[0]) === ".js" && pathService.basename(files[0]) !== "build.js") {
            console.log(path + " -- add " + fullPath);
            jsFilesFound.push(fullPath);
        }
        if (fs.lstatSync(fullPath).isDirectory() && ignore.indexOf(fullPath) === -1) {
            jsFilesFound = jsFilesFound.concat(getJsFilesInPath(fullPath));
        }
        files.shift();
    }
    return jsFilesFound;
}

(function testGetJSFilesInPath() {
    var expected = ['.test\\1.js', '.test\\folder\\2.js', '.test\\3.js'];
    var actual = getJsFilesInPath('./.test');
    for (var i = 0; i < expected.length; ++i) {
        if (actual.indexOf(expected[i]) === -1) {
            throw new Error(
                'failed test: does not contain expected file \n' +
                'acutal: [' + actual.join(', ') + ']\n' +
                'expected: [' + expected.join(', ') + ']'
            );
        }
    }
    for (var i = 0; i < actual.length; ++i) {
        if (expected.indexOf(actual[i]) === -1) {
            throw new Error('failed test: contains unexpected elements');
        }
    }
})()

const concatAndCopy = () => {
    var writeStream = fs.createWriteStream('./ild-games-panel.jsx', { autoClose: false });
    for (var i = 0; i < jsFiles.length; ++i) {
        var readStream = fs.createReadStream(jsFiles[i]);
        readStream.pipe(writeStream);
        readStream.close();
    }
    writeStream.close();
    console.log('copying to script folder');
    fs.createReadStream(
        './ild-games-panel.jsx'
    ).pipe(
        fs.createWriteStream(
            "C:/Program Files/Adobe/Adobe After Effects CC 2018/Support Files/Scripts/ScriptUI Panels/ild-games-panel.jsx"
        )
    );
}

var jsFiles = getJsFilesInPath('./');
console.log('files found:');
for (var i = 0; i < jsFiles.length; ++i) {
    console.log(jsFiles[i]);
}

fs.watch(jsFiles[0], {}, function() {
    concatAndCopy();
});



