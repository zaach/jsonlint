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
    sort : {
      string: '-s, --sort-keys',
      help: 'sort object keys'
    },
    inplace : {
      string: '-i, --in-place',
      help: 'overwrite the file'
    },
    indent : {
      string: '-t CHAR, --indent CHAR',
      default: "  ",
      help: 'character(s) to use for indentation'
    }
  })
  .parseArgs();


function parse (source) {
  try {
    var parsed = options.sort ?
                    sortObject(parser.parse(source)) :
                    parser.parse(source); 
    return JSON.stringify(parsed,null,options.indent);
  } catch (e) {
    sys.puts(e);
    process.exit(1);
  }
}

function readInputJSON(callback) {
  if (options.file) {
    var path = require('path').join(process.cwd(), options.file);
    fs.readFile(path, 'utf8', callback);
  } else {
    var stdin = process.openStdin();
    stdin.setEncoding('utf8');
    var source = '';
    stdin.on('data', function (chunk) {
      source += chunk.toString('utf8');
    });
    stdin.on('end', function () {
      callback(null, source);
    });
  }
}

function main (args) {
  readInputJSON(function (err, source) {
    if (err) {
      console.warn(err);
      process.exit(1);
    }

    // Parse the given JSON data (parser quits if it's not correct).
    var parsedJSON = parse(source);

    // Should we write back or just quit right away?
    if (parsedJSON && options.file && options.inplace) {
      var path = require('path').join(process.cwd(), options.file);
      // Open file.
      fs.open(path, 'w', function (err, fd) {
        if (err) {
          console.warn("Could not open file", file, "for writing:", err);
          process.exit(1);
        }
        // Write parsed JSON to file.
        fs.write(fd, parsedJSON, 0, 'utf-8', function (err, res) {
          if (err) {
            console.warn("Could not write file", file, "for writing:", err);
            process.exit(1);
          }
          process.exit();
        });
      });
    } else {
      // No need to write back file -- just print to stdout and quit.
      sys.puts(parsedJSON);
    }
  });
}

// from http://stackoverflow.com/questions/1359761/sorting-a-json-object-in-javascript
function sortObject(o) {
  if (Object.prototype.toString.call(o) != '[object Object]')
    return o;
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
