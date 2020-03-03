FROM httpd:2.4.41-alpine

RUN addgroup --system httpd &&\
    adduser --system httpd --ingroup httpd

COPY /conf /usr/local/apache2/conf/
COPY /www/ /home/httpd/www

LABEL version="0.0.1"
