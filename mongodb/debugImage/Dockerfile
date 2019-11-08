FROM bitnami/mongodb:4.2

COPY /falseentrypoint.sh /falseentrypoint.sh

ENTRYPOINT [ "/falseentrypoint.sh" ]
CMD [ "/run.sh" ]
LABEL version="0.0.1"
