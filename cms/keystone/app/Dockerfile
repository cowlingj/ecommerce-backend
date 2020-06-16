FROM node:14.3.0-buster AS build

COPY . /usr/lib/app/

WORKDIR /usr/lib/app

RUN npm ci

RUN npm run build

FROM node:14.3.0-buster AS run

COPY --from=build /usr/lib/app/dist /usr/lib/app/dist
COPY --from=build /usr/lib/app/package.json /usr/lib/app/package.json
COPY --from=build /usr/lib/app/package-lock.json /usr/lib/app/package-lock.json

RUN npm ci

ENTRYPOINT [ "npm", "run", "start" ]

LABEL version="0.0.7"
