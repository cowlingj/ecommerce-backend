
if [ mongo --username "$ADMIN_USERNAME" --password "$ADMIN_PASSWORD" -- "$ADMIN_DB" ]; then
  exit 0
fi

mongo --username "$ADMIN_USERNAME" --password "$ADMIN_PASSWORD" -- "$ADMIN_DB" <<EOF
  db.createUser({
      user: "$CMS_USERNAME",
      pwd: "$CMS_PASSWORD",
      roles: [
        { role: "dbOwner", db: "$CMS_DB" }
      ]
    })
EOF