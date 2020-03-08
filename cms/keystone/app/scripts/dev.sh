#!/usr/bin/env bash

set -eu

. scripts/variables.sh
export NODE_ENV=development

nodemon
