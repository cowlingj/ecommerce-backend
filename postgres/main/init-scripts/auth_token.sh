
echo "user: $POSTGRES_USER"

psql --username "$POSTGRES_USER" <<EOF
CREATE DATABASE IF NOT EXISTS auth
USE auth

INSERT INTO authentication_keys (id, permissions) VALUES
  ('test-key', NULL);
EOF