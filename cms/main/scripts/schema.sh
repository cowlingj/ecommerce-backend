#!/usr/bin/env bash

set -eu

. scripts/variables.sh >&2
. scripts/clean.sh >&2
. scripts/_transpile.sh >&2

mkdir --parents "$INTERMEDIATES_SCHEMA/" || true

babel --copy-files --extensions "js,.ts" --out-dir "$INTERMEDIATES_SCHEMA/$SCHEMA_SRC" "$SCHEMA_SRC" >&2
cp -r "$INTERMEDIATES_BABEL/." "$INTERMEDIATES_SCHEMA/$SRC/" >&2

node "$INTERMEDIATES_SCHEMA/$SCHEMA_SRC/$SCHEMA_ENTRY"
