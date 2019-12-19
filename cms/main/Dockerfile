FROM node:13.2.0-buster as build

COPY . /usr/lib/app/

WORKDIR /usr/lib/app

RUN npm install
RUN npm run build

FROM node:13.2.0-buster  as run

COPY --from=build /usr/lib/app/package.json /usr/lib/app/package.json
COPY --from=build /usr/lib/app/package-lock.json /usr/lib/app/package-lock.json
COPY --from=build /usr/lib/app/dist /usr/lib/app/dist
COPY --from=build /usr/lib/app/scripts /usr/lib/app/scripts

WORKDIR /usr/lib/app

RUN npm install --production

ENTRYPOINT [ "npm", "run", "start" ]

LABEL version="0.0.2"
