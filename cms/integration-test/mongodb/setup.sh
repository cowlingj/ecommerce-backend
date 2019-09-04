mongo -- "$MONGO_INITDB_DATABASE" <<EOF

  db.createUser({
    user: "$DB_USER",
    pwd: "$DB_PASSWORD",
    roles: [
      { role: "$DB_ROLE", db: "cms" }
    ]
  })

EOF