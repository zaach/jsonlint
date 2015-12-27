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

function parseIntArg (argName, potentialInt, min, max) {
  var result;
  if (typeof potentialInt === 'number') {
    result = Math.floor(potentialInt);
  } else {
    result = parseInt(potentialInt, 10);
  }

  if (isNaN(result)) {
    throw new Error('"' + potentialInt + '" is not a valid number for "' + argName + '"!');
  } else if ((min !== undefined && result < min) || (max !== undefined && result > max)) {
    throw new Error('"' + result + '" is not in the range between >= ' + min + ' and <= ' + max + ' for "' + argName + '"!');
  }

  return result;
}

function printDiff (linesSource, errorLineNumberSource, linesResult, errorLineNumberResult, options) {
  var contextWindow;
  try {
    contextWindow = parseIntArg('--diff-context', options.diffContext);
  } catch (err) {
    contextWindow = 0;
  }
  printContext(linesSource, errorLineNumberSource, contextWindow, 'source');
  printContext(linesResult, errorLineNumberResult, contextWindow, 'result');
}

function makeDiff (source, result, options) {
  var ignoreEmptyLines;
  try {
    ignoreEmptyLines = parseIntArg('--ignore-empty-lines', options.ignoreEmptyLines);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
  var ignoreTrailingNewLines;
  try {
    ignoreTrailingNewLines = parseIntArg('--ignore-trailing-newlines', options.ignoreTrailingNewLines);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
  var linesSource = source.split(LINE_FEED);
  var linesResult = result.split(LINE_FEED);
  var consecutiveEmptyLinesFound = 0;
  var lineNumberSource = 0;
  var lineNumberResult = 0;
  while (lineNumberSource !== linesSource.length && lineNumberResult !== linesResult.length) {
    if (linesSource[lineNumberSource] !== linesResult[lineNumberResult]) {
      if (linesSource[lineNumberSource].length === 0 &&
          consecutiveEmptyLinesFound < ignoreEmptyLines) {
        ++consecutiveEmptyLinesFound;
        ++lineNumberSource;
      } else {
        break;
      }
    } else {
      consecutiveEmptyLinesFound = 0;
      ++lineNumberSource;
      ++lineNumberResult;
    }
  }

  var trailingEmptyLinesFound = 0;
  if (lineNumberSource < linesSource.length) {
    for (var pos = lineNumberSource; pos !== linesSource.length; ++pos) {
      if (linesSource[pos] === '') {
        ++trailingEmptyLinesFound;
      } else {
        trailingEmptyLinesFound = 0;
        break;
      }
    }
  }

  if (lineNumberSource === linesSource.length ||
      (trailingEmptyLinesFound > 0 && trailingEmptyLinesFound <= ignoreTrailingNewLines)) {
    process.exit(0);
  } else {
    if (!options.quiet) {
      printDiff(linesSource, lineNumberSource, linesResult, lineNumberResult, options);
    }
    process.exit(1);
  }
}

module.exports = exports = makeDiff;
