### STAGE 1: Build ###
FROM node:21-alpine AS build
WORKDIR /usr/src/app
ARG REACT_APP_AUTH_SERVER=localhost:3002
ARG SHARED_STORE=localhost:3003
COPY package.json package-lock.json ./

RUN npm ic  --omit=dev
# COPY . /src
COPY . .
RUN npm link @angular/cli
RUN npm run build
### STAGE 2: Run ###
FROM nginx:1.25.3-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/mangor-authentication /usr/share/nginx/html