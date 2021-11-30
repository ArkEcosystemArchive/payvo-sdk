#!/usr/bin/env bash

pnpm run clean
pnpm run rebuild
NODE_ENV=production pnpm run build:release

for dir in `find packages -mindepth 1 -maxdepth 1 -type d | sort -nr`; do
    cd $dir
    echo $PWD
    NPM_AUTH_TOKEN=$1 pnpm publish --access=public --publish-branch=testbranch --tag=next
    cd ../..
done
