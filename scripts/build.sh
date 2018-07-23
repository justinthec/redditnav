#!/usr/bin/env bash

# clean up
rm -rf lib
mkdir lib

browsers=( 'chrome' 'firefox' )
for browser in "${browsers[@]}"
do
  mkdir "lib/$browser"
  cp -R src/* "lib/$browser"
done