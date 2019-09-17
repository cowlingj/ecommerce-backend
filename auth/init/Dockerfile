FROM docker.pkg.github.com/cowlingj/ecommerce-backend/client.postgres.data:0.0.1
LABEL version="0.0.1"

COPY /init-scripts/ /init

ENTRYPOINT [ "sh", "-c", "for f in /init/*; do source \"$f\"; done" ]