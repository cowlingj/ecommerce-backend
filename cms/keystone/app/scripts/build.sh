#!/usr/bin/env bash

set -eu

. scripts/variables.sh

scripts/clean.sh

scripts/_transpile.sh

[ ! -d "$DIST" ] && mkdir --parents "$DIST"
cp -r "$INTERMEDIATES_BABEL/." "$DIST"
keystone build --entry "$INTERMEDIATES_BABEL/$ENTRY" --out "$ASSETS"

