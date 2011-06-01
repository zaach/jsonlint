#!/usr/bin/env node

var sys = require("sys");
var fs = require("fs");
var parser = require("./jsonlint").parser;
var options = require("nomnom")
  .scriptName("jsonlint")
  .opts({
    file: {
      position: 0,
      help: "file to parse; otherwise uses stdin"
    },
    version: {
      string: '-v, --version',
      help: 'print version and exit',
      callback: function() {
        return JSON.parse(fs.readFileSync(__dirname + "/../package.json", "utf8")).version;
      }
    },
    indent : {
      string: '-t CHAR, --indent CHAR',
      default: " ",
      help: 'character(s) to use for indentation'
    }
  })
  .parseArgs();


function parse (source) {
  try {
    sys.puts(JSON.stringify(parser.parse(source),null,"  "));
  } catch (e) {
    sys.puts(e);
    process.exit(1);
  }
}

function main (args) {
  var source = '';
  if (options.file) {
    source = fs.readFileSync(require('path').join(process.cwd(), options.file), "utf8");
    parse(source);
  } else {
    var stdin = process.openStdin();
    stdin.setEncoding('utf8');

    stdin.on('data', function (chunk) {
      source += chunk.toString('utf8');
    });
    stdin.on('end', function () {
      parse(source);
    });
  }
}

main(process.argv.slice(1));
