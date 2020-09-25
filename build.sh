#! /bin/bash

set -e

npx babel js/main.js -o js/main.babel.js
npx rollup -c

