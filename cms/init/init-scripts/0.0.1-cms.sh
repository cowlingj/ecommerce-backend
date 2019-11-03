if mongo --verbose --username "$CMS_USERNAME" --password "$CMS_PASSWORD" --host "$DB_HOST" --authenticationDatabase "$ADMIN_DB" -- "$CMS_DB"; then
  echo "database \"$CMS_DB\" already exists, exiting"
  exit 0
fi

echo "database \"$CMS_DB\" doesn't exist, creating (entering verbose mode)"

echo "CMS u ($CMS_USERNAME) pw ($CMS_PASSWORD) ADMIN u ($ADMIN_USERNAME) pw ($ADMIN_PASSWORD)"

mongo --username "$ADMIN_USERNAME" --password "$ADMIN_PASSWORD" --host "$DB_HOST" --verbose <<EOF
  use $ADMIN_DB
  db.createUser({
      user: "$CMS_USERNAME",
      pwd: "$CMS_PASSWORD",
      roles: [
        { role: "dbOwner", db: "$CMS_DB" }
      ]
  });
EOF