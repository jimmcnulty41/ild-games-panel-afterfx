var copy = require('copyfiles');

copy(["./*.jsx", "C:/Program Files/Adobe/Adobe After Effects CC 2018/Support Files/Scripts/ScriptUI Panels/"], {}, function(arg) {console.log(arg);});