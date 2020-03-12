FROM nginx:mainline

COPY /nginx.conf /etc/nginx/nginx.conf.template
COPY /www/ /home/www

ENV PORT="80" \
    STATUS_PORT="8080" \
    BASE_PATH="/" \
    EVENTS_URI="events.localhost" \
    PRODUCTS_URI="products.localhost" \
    RESOURCES_URI="resources.localhost"

CMD [ "/bin/bash", \
      "-c", \
      "envsubst < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && exec nginx -g 'daemon off;'" \
    ]

LABEL version="0.0.2"
