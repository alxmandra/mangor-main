FROM node:21-alpine
# uncomment below, if we need curl inside of container
# RUN apk --no-cache add curl
COPY . /src
COPY package.json package-lock.json ./
WORKDIR /src

ENV SHARED_STORE localhost:3003
ENV REACT_APP_AUTH_SERVER localhost:3002
ENV AUTHENTICATION localhost:3001

RUN npm i @types/react-router-bootstrap -g
RUN npm run build
RUN npm install -g serve

EXPOSE 3000

CMD serve -s build