FROM node:lts

COPY / /usr/lib/app
WORKDIR /usr/lib/app
RUN npm install --production
ENTRYPOINT [ "npm", "run", "start" ]
