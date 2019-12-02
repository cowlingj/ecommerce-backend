#!/usr/bin/env bash

set -eu

. scripts/variables.sh

scripts/_transpile.sh
keystone dev --entry "$INTERMEDIATES_BABEL/$ENTRY"
