psql <<EOF
INSERT INTO authentication_keys (id, permissions) VALUES
  ('$AUTH_KEY', NULL);
EOF