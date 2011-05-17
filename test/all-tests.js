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

exports["test a json payload should be an object or array not a string"] = function () {
  var json = fs.readFileSync(__dirname + "/fails/1.json");
  assert["throws"](function () {parser.parse(json)}, "should throw error");
};

exports["test unclosed array"] = function () {
  var json = fs.readFileSync(__dirname + "/fails/2.json");
  assert["throws"](function () {parser.parse(json)}, "should throw error");
};

exports["test unquotedkey keys must be quoted"] = function () {
  var json = fs.readFileSync(__dirname + "/fails/3.json");
  assert["throws"](function () {parser.parse(json)}, "should throw error");
};

exports["test extra comma"] = function () {
  var json = fs.readFileSync(__dirname + "/fails/4.json");
  assert["throws"](function () {parser.parse(json)}, "should throw error");
};

exports["test double extra comma"] = function () {
  var json = fs.readFileSync(__dirname + "/fails/5.json");
  assert["throws"](function () {parser.parse(json)}, "should throw error");
};

exports["test missing value"] = function () {
  var json = fs.readFileSync(__dirname + "/fails/6.json");
  assert["throws"](function () {parser.parse(json)}, "should throw error");
};

exports["test comma after the close"] = function () {
  var json = fs.readFileSync(__dirname + "/fails/7.json");
  assert["throws"](function () {parser.parse(json)}, "should throw error");
};

exports["test extra close"] = function () {
  var json = fs.readFileSync(__dirname + "/fails/8.json");
  assert["throws"](function () {parser.parse(json)}, "should throw error");
};

exports["test extra comma after value"] = function () {
  var json = fs.readFileSync(__dirname + "/fails/9.json");
  assert["throws"](function () {parser.parse(json)}, "should throw error");
};

exports["test extra value after close with misplaced quotes"] = function () {
  var json = fs.readFileSync(__dirname + "/fails/10.json");
  assert["throws"](function () {parser.parse(json)}, "should throw error");
};

exports["test illegal expression addition"] = function () {
  var json = fs.readFileSync(__dirname + "/fails/11.json");
  assert["throws"](function () {parser.parse(json)}, "should throw error");
};

exports["test illegal invocation of alert"] = function () {
  var json = fs.readFileSync(__dirname + "/fails/12.json");
  assert["throws"](function () {parser.parse(json)}, "should throw error");
};

exports["test numbers cannot have leading zeroes"] = function () {
  var json = fs.readFileSync(__dirname + "/fails/13.json");
  assert["throws"](function () {parser.parse(json)}, "should throw error");
};

exports["test numbers cannot be hex"] = function () {
  var json = fs.readFileSync(__dirname + "/fails/14.json");
  assert["throws"](function () {parser.parse(json)}, "should throw error");
};

exports["test illegal backslash escape \\0"] = function () {
  var json = fs.readFileSync(__dirname + "/fails/15.json");
  assert["throws"](function () {parser.parse(json)}, "should throw error");
};

exports["test unquoted text"] = function () {
  var json = fs.readFileSync(__dirname + "/fails/16.json");
  assert["throws"](function () {parser.parse(json)}, "should throw error");
};

exports["test illegal backslash escape \\x"] = function () {
  var json = fs.readFileSync(__dirname + "/fails/17.json");
  assert["throws"](function () {parser.parse(json)}, "should throw error");
};

exports["test too deep"] = function () {
  var json = fs.readFileSync(__dirname + "/fails/18.json");
  assert["throws"](function () {parser.parse(json)}, "should throw error");
};

exports["test missing colon"] = function () {
  var json = fs.readFileSync(__dirname + "/fails/19.json");
  assert["throws"](function () {parser.parse(json)}, "should throw error");
};

exports["test double colon"] = function () {
  var json = fs.readFileSync(__dirname + "/fails/20.json");
  assert["throws"](function () {parser.parse(json)}, "should throw error");
};

exports["test comma instead of colon"] = function () {
  var json = fs.readFileSync(__dirname + "/fails/21.json");
  assert["throws"](function () {parser.parse(json)}, "should throw error");
};

exports["test colon instead of comma"] = function () {
  var json = fs.readFileSync(__dirname + "/fails/22.json");
  assert["throws"](function () {parser.parse(json)}, "should throw error");
};

exports["test bad raw value"] = function () {
  var json = fs.readFileSync(__dirname + "/fails/23.json");
  assert["throws"](function () {parser.parse(json)}, "should throw error");
};

exports["test single quotes"] = function () {
  var json = fs.readFileSync(__dirname + "/fails/24.json");
  assert["throws"](function () {parser.parse(json)}, "should throw error");
};

exports["test tab character in string"] = function () {
  var json = fs.readFileSync(__dirname + "/fails/25.json");
  assert["throws"](function () {parser.parse(json)}, "should throw error");
};

exports["test tab character in string 2"] = function () {
  var json = fs.readFileSync(__dirname + "/fails/26.json");
  assert["throws"](function () {parser.parse(json)}, "should throw error");
};

exports["test line break in string"] = function () {
  var json = fs.readFileSync(__dirname + "/fails/27.json");
  assert["throws"](function () {parser.parse(json)}, "should throw error");
};

exports["test line break in string in array"] = function () {
  var json = fs.readFileSync(__dirname + "/fails/28.json");
  assert["throws"](function () {parser.parse(json)}, "should throw error");
};

exports["test 0e"] = function () {
  var json = fs.readFileSync(__dirname + "/fails/29.json");
  assert["throws"](function () {parser.parse(json)}, "should throw error");
};

exports["test 0e+"] = function () {
  var json = fs.readFileSync(__dirname + "/fails/30.json");
  assert["throws"](function () {parser.parse(json)}, "should throw error");
};

exports["test 0e+ 1"] = function () {
  var json = fs.readFileSync(__dirname + "/fails/31.json");
  assert["throws"](function () {parser.parse(json)}, "should throw error");
};

exports["test comma instead of closing brace"] = function () {
  var json = fs.readFileSync(__dirname + "/fails/32.json");
  assert["throws"](function () {parser.parse(json)}, "should throw error");
};

exports["test bracket mismatch"] = function () {
  var json = fs.readFileSync(__dirname + "/fails/33.json");
  assert["throws"](function () {parser.parse(json)}, "should throw error");
};

exports["test pass-1"] = function () {
  var json = fs.readFileSync(__dirname + "/passes/1.json").toString();
  assert.doesNotThrow(function () {parser.parse(json)}, "should pass");
}

exports["test pass-2"] = function () {
  var json = fs.readFileSync(__dirname + "/passes/2.json").toString();
  assert.doesNotThrow(function () {parser.parse(json)}, "should pass");
}

exports["test pass-3"] = function () {
  var json = fs.readFileSync(__dirname + "/passes/3.json").toString();
  assert.doesNotThrow(function () {parser.parse(json)}, "should pass");
}

if (require.main === module)
    require("test").run(exports);
