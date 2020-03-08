#!/usr/bin/env bash

set -eu

. scripts/variables.sh

rm -r "$INTERMEDIATES" "$DIST" || true
