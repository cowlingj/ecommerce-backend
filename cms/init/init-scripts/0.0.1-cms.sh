if mongo --verbose --username "$CMS_USERNAME" --password "$CMS_PASSWORD" --host "$DB_HOST" -- "$CMS_DB"; then
  echo "database \"$CMS_DB\" already exists, exiting"
  exit 0
fi

echo "database \"$CMS_DB\" doesn't exist, creating (entering verbose mode)"

set -xv

mongo --username "$ADMIN_USERNAME" --password "$ADMIN_PASSWORD" --host "$DB_HOST" --verbose -- "$ADMIN_DB" <<EOF
  db.createUser({
      user: "$CMS_USERNAME",
      pwd: "$CMS_PASSWORD",
      roles: [
        { role: "dbOwner", db: "$CMS_DB" }
      ]
    })
EOF