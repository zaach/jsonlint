#!/usr/bin/env node

var sys = require("sys");
var parser = require("./jsonlint").parser;

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
  if (args[1]) {
    source = require('fs').readFileSync(require('path').join(process.cwd(), args[1]), "utf8");
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
