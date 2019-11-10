#!/usr/bin/env bash

if [[ -n "$MONGODB_ROOT_PASSWORD" ]] || [[ -n "$MONGODB_PASSWORD" ]]; then
  authorization="$(yq read "$MONGODB_CONF_FILE" security.authorization)"
  if [[ "$authorization" = "disabled" ]]; then
    echo "should turn auth on"
  else
    echo "auth is already on"
  fi
else
  echo "root pw ($MONGODB_ROOT_PASSWORD) and pw ($MONGODB_PASSWORD) not set, no auth"
fi

. /entrypoint.sh /run.sh
