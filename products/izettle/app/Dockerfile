FROM node:13.5.0-slim as build

COPY / /usr/lib/app
WORKDIR /usr/lib/app
RUN npm install

RUN npm run build

FROM node:13.5.0-slim as run

COPY --from=build /usr/lib/app/dist /usr/lib/app/dist
COPY --from=build /usr/lib/app/package.json /usr/lib/app/package.json
COPY --from=build /usr/lib/app/package-lock.json /usr/lib/app/package-lock.json

WORKDIR /usr/lib/app
RUN npm install --production

EXPOSE 80
ENTRYPOINT [ "npm", "run", "start" ]

LABEL version="0.0.5"
