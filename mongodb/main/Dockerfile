FROM mongo:4.2.0
LABEL version="0.0.1"

COPY /mongod.conf /etc/mongod.conf
COPY /init-scripts/ /docker-entrypoint-initdb.d/
