FROM node:21-alpine

COPY . /src
COPY package.json package-lock.json ./
WORKDIR /src

RUN npm ic  --omit=dev
RUN npm run build

EXPOSE 3003

CMD npm run serve