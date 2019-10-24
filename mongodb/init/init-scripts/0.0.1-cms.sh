mongo -- "cms" <<EOF
  db.createUser({
      user: "cms",
      pwd: "cms",
      roles: [
        { role: "dbOwner", db: "cms" }
      ]
    })
EOF