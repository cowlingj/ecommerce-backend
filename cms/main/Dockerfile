FROM node:lts as build

COPY . /usr/lib/app/
WORKDIR /usr/lib/app
RUN npm install
RUN npm run build

FROM node:lts as run

COPY --from=build /usr/lib/app/package.json /usr/lib/app/package.json
COPY --from=build /usr/lib/app/dist /usr/lib/app/dist
WORKDIR /usr/lib/app
RUN npm install --production

ENTRYPOINT [ "npm", "run", "start" ]

LABEL version="0.0.1"
