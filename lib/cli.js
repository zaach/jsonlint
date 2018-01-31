#!/usr/bin/env node

var fs = require("fs");
var path = require("path");
var program = require("commander");
var JSV = require("JSV").JSV;
var parser = require("./jsonlint").parser;
var formatter = require("./formatter.js").formatter;
var pkg = require('../package.json');

var hasError = false;

program
  .version(pkg.version, '-v, --version')
  .description(pkg.description)
  .name(pkg.name)
  .arguments('[file...]')
  .action(main)
  .option('-s, --sort-keys', 'sort object keys')
  .option('-i, --in-place', 'overwrite the file')
  .option('-t, --indent <char>', 'character(s) to use for indentation', '  ')
  .option('-c, --compact', 'compact error display')
  .option('-V, --validate', 'a JSON schema to use for validation')
  .option('-e, --environment <schema>', 'which specification of JSON Schema the validation file uses', 'json-schema-draft-03')
  .option('-q, --quiet', 'do not print the parsed json to STDOUT')
  .option('-p, --pretty-print', 'force pretty printing even if invalid')
  .allowUnknownOption()
  .parse(process.argv);

function main(files) {
  var options = program.opts();

  if (files) {
    files.forEach(function (file) {
      var filePath = path.normalize(file);
      var code = parse(fs.readFileSync(filePath, 'utf8'), file, options);

      if (options.inPlace) {
        fs.writeSync(fs.openSync(json, 'w+'), code, 0, "utf8");
      } else {
        if (!options.quiet) { console.log(code) };
      }
    });
  } else {
    var stdin = process.openStdin();
    var code = '';

    stdin.setEncoding('utf8');
    stdin.on('data', function (chunk) {
      code += chunk.toString('utf8');
    });
    stdin.on('end', function () {
      if (!options.quiet) { console.log(parse(code, null, options)) };
    });
  }

  hasError && process.exit(1);
}

function parse(source, file, options) {
  var parsed,
    formatted;

  if (options.compact) {
    var fileName = file ? file + ': ' : '';
    parser.parseError = parser.lexer.parseError = function (str, hash) {
      console.error(fileName + 'line ' + hash.loc.first_line + ', col ' + hash.loc.last_column + ', found: \'' + hash.token + '\' - expected: ' + hash.expected.join(', ') + '.');
      throw new Error(str);
    };
  }

  try {
    parsed = options.sortKeys ?
      sortObject(parser.parse(source)) :
      parser.parse(source);

    if (options.validate) {
      var env = JSV.createEnvironment(options.environment);
      var schema = JSON.parse(fs.readFileSync(path.normalize(options.validate), "utf8"));
      var report = env.validate(parsed, schema);
      if (report.errors.length) {
        throw report.errors.reduce(schemaError, 'Validation Errors:');
      }
    }

    return JSON.stringify(parsed, null, options.indent);
  } catch (e) {
    if (options.prettyPrint) {
      /* From https://github.com/umbrae/jsonlintdotcom:
       * If we failed to validate, run our manual formatter and then re-validate so that we
       * can get a better line number. On a successful validate, we don't want to run our
       * manual formatter because the automatic one is faster and probably more reliable.
       */

      try {
        formatted = formatter.formatJson(source, options.indent);
        // Re-parse so exception output gets better line numbers
        parsed = parser.parse(formatted);
      } catch (e) {
        if (!options.compact) {
          console.error(e);
        }
        // force the pretty print before exiting
        console.log(formatted);
      }
    } else {
      if (!options.compact) {
        console.error(e);
      }
    }
    hasError = true;
  }
}

function schemaError(str, err) {
  return str +
    "\n\n" + err.message +
    "\nuri: " + err.uri +
    "\nschemaUri: " + err.schemaUri +
    "\nattribute: " + err.attribute +
    "\ndetails: " + JSON.stringify(err.details);
}

// from http://stackoverflow.com/questions/1359761/sorting-a-json-object-in-javascript
function sortObject(o) {
  if (Array.isArray(o)) {
    return o.map(sortObject);
  } else if (Object.prototype.toString.call(o) !== '[object Object]') {
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
