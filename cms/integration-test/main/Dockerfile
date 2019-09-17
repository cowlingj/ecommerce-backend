FROM node:lts
LABEL version="0.0.1-test"


COPY / /usr/lib/app
WORKDIR /usr/lib/app
RUN npm install

ENTRYPOINT [ "npm", "run", "test" ]