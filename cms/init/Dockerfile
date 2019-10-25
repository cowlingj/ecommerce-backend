FROM mongo:4.2.0
LABEL version="0.0.1"

COPY /init-scripts/ /init

ENTRYPOINT [ "sh", "-c", "for f in /init/*; do . \"$f\"; done" ]
