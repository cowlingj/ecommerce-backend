FROM node:lts
LABEL version="0.0.1"

COPY package-lock.json /usr/lib/app/
COPY package.json /usr/lib/app/
COPY /src /usr/lib/app/src
WORKDIR /usr/lib/app
RUN npm install --production
ENTRYPOINT [ "npm", "run", "start" ]
