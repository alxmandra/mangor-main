FROM node:21-alpine
WORKDIR /src
COPY . /src

COPY package.json package-lock.json ./

RUN npm ic  --omit=dev

EXPOSE 3002

CMD npm start