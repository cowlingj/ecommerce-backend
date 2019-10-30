if mongo --verbose --username "$CMS_USERNAME" --password "$CMS_PASSWORD" --host "$DB_HOST" -- "$CMS_DB"; then
  echo "database \"$CMS_DB\" already exists, exiting"
  exit 0
fi

echo "database \"$CMS_DB\" doesn't exist, creating (entering verbose mode)"

echo "ADMIN CREDS: $ADMIN_USERNAME $ADMIN_PASSWORD"
echo "CMS CREDS: $CMS_USERNAME $CMS_PASSWORD"

set -xv

mongo --username "$ADMIN_USERNAME" --password "$ADMIN_PASSWORD" --host "$DB_HOST" --verbose <<EOF
  db.getName();
  print("$CMS_USERNAME");
  print("$CMS_PASSWORD");
  db.createUser({
      user: "$CMS_USERNAME",
      pwd: "$CMS_PASSWORD",
      roles: [
        { role: "dbOwner", db: "$CMS_DB" }
      ]
    })
EOF