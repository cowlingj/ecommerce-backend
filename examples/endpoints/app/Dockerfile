FROM nginx:mainline

COPY /nginx.conf /etc/nginx/nginx.conf.template
COPY /www/ /home/www

ENV PORT="80" \
    STATUS_PORT="8080" \
    BASE_PATH="/" \
    ENDPOINTS_INFO="{ \"endpoints\": [] }"

CMD [ "/bin/bash", \
      "-c", \
      "envsubst < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && exec nginx -g 'daemon off;'" \
    ]

LABEL version="0.0.2"
