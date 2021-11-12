#!/usr/bin/env bash

# Bump
for dir in `find packages -mindepth 1 -maxdepth 1 -type d | sort -nr`; do
    cd $dir
    echo $PWD
    npx sort-package-json package.json
    cd ../..
done
