
FROM node:latest AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5501

CMD [ "node", "server.js" ]