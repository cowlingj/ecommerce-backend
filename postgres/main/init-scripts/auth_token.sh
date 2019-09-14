psql --username "$POSTGRES_USER" <<EOF
CREATE DATABASE auth;
\c auth

INSERT INTO authentication_keys (id, permissions) VALUES
  ('test-key', NULL);
EOF