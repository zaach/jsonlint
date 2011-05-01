
all: build test

build:
	jison src/jsonlint.y src/jsonlint.l
	mv jsonlint.js lib/jsonlint.js
	node scripts/bundle.js | uglifyjs > web/jsonlint.js

test: lib/jsonlint.js test/all-tests.js
	node test/all-tests.js

