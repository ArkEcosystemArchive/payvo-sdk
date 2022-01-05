#!/usr/bin/env bash

for dir in `find packages -mindepth 1 -maxdepth 1 -type d | sort -nr`; do
    cd $dir
    echo $PWD
    NPM_AUTH_TOKEN=$1 pnpm publish --access=public --publish-branch=develop --tag=next
    cd ../..
done
