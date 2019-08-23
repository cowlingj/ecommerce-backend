FROM node:lts

COPY / /usr/lib/app
WORKDIR /usr/lib/app
RUN npm install
RUN npm run build

EXPOSE 80
ENTRYPOINT [ "npm", "run", "start" ]