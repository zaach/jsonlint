JSON Lint
=========

A pure [JavaScript version](http://zaach.github.com/jsonlint/) of the service provided at [jsonlin.com](http://jsonlint.com).

## Command line interface
Install jsonlint with npm to use the command line interface:

    npm install jsonlint -g

Validate a file like so:

    jsonlint myfile.json

or pipe input into stdin:

    cat myfile.json | jsonlint

jsonlint will either report a syntax error with details or pretty print the source if it is valid.

## Module interface

I'm not sure why you wouldn't use the built in `JSON.parse` but you can use jsonlint from a CommonJS module:

    var jsonlint = require("jsonlint");

    jsonlint.parse('{"creative?": false}');

It returns the parsed object or throws an `Error`.
