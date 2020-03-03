FROM httpd:2.4.41-alpine

RUN addgroup --system httpd &&\
    adduser --system httpd --ingroup httpd

COPY /conf /usr/local/apache2/conf/
COPY /www/ /home/httpd/www

ENV HOST="0.0.0.0"
ENV PORT="80"
ENV STATUS_PORT="8080"
ENV BASE_PATH="/"
ENV ADMIN_EMAIL="admin@localhost"
ENV EVENTS_URI="events.localhost"
ENV PRODUCTS_URI="products.localhost"
ENV RESOURCES_URI="resources.localhost"

LABEL version="0.0.1"
