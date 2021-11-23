#!/usr/bin/env bash

echo '{"type": "commonjs"}' > $PWD/distribution/cjs/package.json
echo '{"type": "module"}' > $PWD/distribution/esm/package.json
