
psql <<EOF
USE auth

INSERT INTO authentication_keys (id, permissions) VALUES
  ('$AUTH_ROOT_KEY', NULL);
EOF