var fs = require("fs"),
    assert = require("assert"),
    parser = require("../lib/jsonlint").parser;

exports["test object"] = function () {
    var json = '{"foo": "bar"}';
    assert.deepEqual(parser.parse(json), {"foo": "bar"});
};

exports["test string with escaped line break"] = function () {
    var json = '{"foo": "bar\\nbar"}';
    assert.deepEqual(parser.parse(json), {"foo": "bar\\nbar"});
};

exports["test string with line break"] = function () {
    var json = '{"foo": "bar\nbar"}';
    assert["throws"](function () {parser.parse(json)}, "should throw error");
};

if (require.main === module)
    require("test").run(exports);
