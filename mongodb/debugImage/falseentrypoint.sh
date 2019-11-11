#!/usr/bin/env bash

echo "conf before"
cat "/opt/bitnami/mongodb/conf/mongodb.conf" >&2

if [[ -n "$MONGODB_ROOT_PASSWORD" ]] || [[ -n "$MONGODB_PASSWORD" ]]; then
  authorization="$(yq read "/opt/bitnami/mongodb/conf/mongodb.conf" security.authorization)"
  if [[ "$authorization" = "disabled" ]]; then
    echo "should turn auth on"
  else
    echo "auth is already on"
  fi
else
  echo "root pw ($MONGODB_ROOT_PASSWORD) and pw ($MONGODB_PASSWORD) not set, no auth"
fi

echo "conf after"
cat "/opt/bitnami/mongodb/conf/mongodb.conf" >&2

. /entrypoint.sh /run.sh
