FROM node:lts as build
COPY / /usr/lib/app
WORKDIR /usr/lib/app
RUN npm install
RUN npm run build

FROM node:lts as run
COPY --from=build /usr/lib/app/dist/main.js /usr/lib/app.js

ENTRYPOINT [ "node", "/usr/lib/app.js" ]