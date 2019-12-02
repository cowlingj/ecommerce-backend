#!/usr/bin/env bash

set -eu

. scripts/variables.sh

keystone start "$ASSETS" --entry "$INTERMEDIATES_BABEL/$ENTRY"
