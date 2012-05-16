#!/usr/bin/env node

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
      flag : true,
      string: '-v, --version',
      help: 'print version and exit',
      callback: function() {
        return JSON.parse(fs.readFileSync(__dirname + "/../package.json", "utf8")).version;
      }
    },
    sort : {
      flag : true,
      string: '-s, --sort-keys',
      help: 'sort object keys'
    },
    inplace : {
      flag : true,
      string: '-i, --in-place',
      help: 'overwrite the file'
    },
    indent : {
      string: '-t CHAR, --indent CHAR',
      "default": "  ",
      help: 'character(s) to use for indentation'
    },
    compact : {
        flag : true,
        string: '-c, --compact',
        help : 'compact error display'
    }
  })
  .parseArgs();

if (options.compact) {
    var fileName = options.file? options.file + ': ' : '';
    parser.parseError = parser.lexer.parseError = function(str, hash) {
        console.error(fileName + 'line '+ hash.loc.first_line +', col '+ hash.loc.last_column +', found: \''+ hash.token +'\' - expected: '+ hash.expected.join(', ') +'.');
        throw new Error(str);
    };
}

function parse (source) {
  try {
    var parsed = options.sort ?
                    sortObject(parser.parse(source)) :
                    parser.parse(source);
    return JSON.stringify(parsed,null,options.indent);
  } catch (e) {
    if (! options.compact) {
        console.log(e);
    }
    process.exit(1);
  }
}

function main (args) {
  var source = '';
  if (options.file) {
    var path = require('path').normalize(options.file);
    source = parse(fs.readFileSync(path, "utf8"));
    if (options.inplace) {
      fs.writeSync(fs.openSync(path,'w+'), source, 0, "utf8");
    } else {
      console.log(source);
    }
  } else {
    var stdin = process.openStdin();
    stdin.setEncoding('utf8');

    stdin.on('data', function (chunk) {
      source += chunk.toString('utf8');
    });
    stdin.on('end', function () {
      console.log(parse(source));
    });
  }
}

// from http://stackoverflow.com/questions/1359761/sorting-a-json-object-in-javascript
function sortObject(o) {
  if (Object.prototype.toString.call(o) !== '[object Object]') {
    return o;
  }

  var sorted = {},
  key, a = [];

  for (key in o) {
    if (o.hasOwnProperty(key)) {
      a.push(key);
    }
  }

  a.sort();

  for (key = 0; key < a.length; key++) {
    sorted[a[key]] = sortObject(o[a[key]]);
  }
  return sorted;
}

main(process.argv.slice(1));
