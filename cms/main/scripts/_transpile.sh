#!/usr/bin/env bash

set -eu

. scripts/variables.sh

[ ! -d "$INTERMEDIATES_BABEL" ] && mkdir --parents "$INTERMEDIATES_BABEL"

babel --copy-files --extensions "js,.ts" --out-dir "$INTERMEDIATES_BABEL" "$SRC"
