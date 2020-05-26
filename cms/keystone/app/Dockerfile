FROM node:13.2.0-buster

COPY . /usr/lib/app/

WORKDIR /usr/lib/app

RUN npm install

ENTRYPOINT [ "npm", "run", "start" ]

LABEL version="0.0.4"
