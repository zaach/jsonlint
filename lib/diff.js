var LINE_FEED = process.platform === 'win32' ? '\r\n' : '\n';

function printContext(lines, errorLineNumber, contextWindow, fileName) {
  var firstLine = errorLineNumber - contextWindow;
  if (firstLine < 0) {
    firstLine = 0;
  } else if (firstLine >= lines.length) {
      firstLine = lines.length - 1;
  }
  var lastLine = errorLineNumber + contextWindow;
  if (lastLine >= lines.length) {
    lastLine = lines.length - 1;
  }
  console.log('--- ' + fileName + ': ' + firstLine + ', ' + lastLine + ' ---');
  for (var line = firstLine; line <= lastLine; ++line) {
    if (line === errorLineNumber && contextWindow !== 0) {
      console.log('!' + lines[line]);
    } else {
      console.log(' ' + lines[line]);
    }
  }
}

function printDiff (linesSource, linesResult, errorLineNumber, options) {
  var contextWindow = typeof options.diffContext === 'number' && options.diffContext >= 0 ?
          options.diffContext : 0;
  printContext(linesSource, errorLineNumber, contextWindow, 'source');
  printContext(linesResult, errorLineNumber, contextWindow, 'result');
}

function makeDiff (source, result, options) {
  var linesSource = source.split(LINE_FEED);
  var linesResult = result.split(LINE_FEED);
  if(options.diff) {
    for (var lineNumber = 0; lineNumber !== linesSource.length &&
                 lineNumber !== linesResult.length; ++lineNumber) {
      if (linesSource[lineNumber] !== linesResult[lineNumber]) {
        break;
      }
    }
    if ((lineNumber === linesSource.length || (lineNumber === linesSource.length - 1 &&
                                                linesSource[linesSource.length - 1] === '' &&
                                                options.ignoreTrailingNewLine === true)) &&
        lineNumber === linesResult.length) {
      process.exit(0);
    } else {
      if (! options.quiet) {
          printDiff(linesSource, linesResult, lineNumber, options);
      }
      process.exit(1);
    }
  }
}

module.exports = exports = makeDiff;
