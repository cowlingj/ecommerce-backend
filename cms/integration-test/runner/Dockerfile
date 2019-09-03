FROM node:lts

COPY / /usr/lib/app
WORKDIR /usr/lib/app
RUN npm install

ENTRYPOINT [ "npm", "run", "test" ]