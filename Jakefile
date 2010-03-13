#!/usr/bin/env narwhal
 
var FILE = require("file"),
    ENV = require("system").env,
    OS = require("os"),
    jake = require("jake");

var cwd = FILE.path(FILE.cwd());

jake.task("build", ["build:commonjs", "build:web"]);

jake.task("build:commonjs", function () {
    OS.system(['jison', 'src/grammar.jison', 'src/grammar.jisonlex']);
    OS.system(['mv', 'grammar.js', 'lib/jsonlint.js']);
});

jake.task("build:web", function () {
    var lint = cwd.join('lib', 'jsonlint.js');

    var sourceArray = ["var jsonlint = (function(){var require=true,module=false;var exports={};"];
    sourceArray.push(lint.read({charset: "utf-8"}),
        "return exports;})()");

    var source = require("jsmin").encode(sourceArray.join("\n"));

    var stream = cwd.join('web', 'jsonlint.js').open("w");
    stream.print(source).close();
});

jake.task("test", function () {
    OS.system(['narwhal', 'tests/all-tests.js']);
});
