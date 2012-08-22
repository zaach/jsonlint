#!/usr/bin/env node

var fs = require("fs");
var path = require("path");
var parser = require("./jsonlint").parser;
var JSV = require("JSV").JSV;

var options = require("nomnom")
  .script("jsonlint")
  .options({
    file: {
      position: 0,
      help: "file to parse; otherwise uses stdin"
    },
    version: {
      flag : true,
      string: '-v, --version',
      help: 'print version and exit',
      callback: function() {
        return require("../package").version;
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
    },
    validate : {
        string: '-V, --validate',
        help : 'a JSON schema to use for validation'
    },
    env : {
        string: '-e, --environment',
        "default": "json-schema-draft-03",
        help: 'which specification of JSON Schema the validation file uses'
    },
    quiet: {
        flag:  true,key: "value",
        string: '-q, --quiet',
        "default": false,
        help : 'do not print the parsed json to STDOUT'
    }
  }).parse();

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

    if (options.validate) {
      var env = JSV.createEnvironment(options.env);
      var schema = JSON.parse(fs.readFileSync(path.normalize(options.validate), "utf8"));
      var report = env.validate(parsed, schema);
      if (report.errors.length) {
        throw report.errors.reduce(schemaError, 'Validation Errors:');
      }
    }

    return JSON.stringify(parsed,null,options.indent);
  } catch (e) {
    if (! options.compact) {
        console.error(e);
    }
    process.exit(1);
  }
}

function schemaError (str, err) {
  return str +
         "\n\n"+err.message +
         "\nuri: " + err.uri +
         "\nschemaUri: " + err.schemaUri +
         "\nattribute: " + err.attribute +
         "\ndetails: " + JSON.stringify(err.details);
}

function main (args) {
  var source = '';
  if (options.file) {
    var json = path.normalize(options.file);
    source = parse(fs.readFileSync(json, "utf8"));
    if (options.inplace) {
      fs.writeSync(fs.openSync(path,'w+'), source, 0, "utf8");
    } else {
      if (! options.quiet) { console.log(source)};
    }
  } else {
    var stdin = process.openStdin();
    stdin.setEncoding('utf8');

    stdin.on('data', function (chunk) {
      source += chunk.toString('utf8');
    });
    stdin.on('end', function () {
      if (! options.quiet) {console.log(parse(source))};
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
