#!/usr/bin/env bash

set -eu

. scripts/variables.sh

keystone start "$ASSETS" --entry "$DIST/$ENTRY"
