FROM gcr.io/gke-test-253221/client.postgres.data:0.0.1
LABEL version="0.0.1"

COPY /init-scripts/ /init

ENTRYPOINT [ "sh", "-c", "for f in /init/*; do source \"$f\"; done" ]