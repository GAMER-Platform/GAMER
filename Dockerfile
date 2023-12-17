FROM node:latest AS build
FROM ubuntu:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install body-parser@1.20.2
RUN npm install chai-http@4.4.0
RUN npm install chai@4.3.10
RUN npm install cors@2.8.5
RUN npm install ejs@3.1.9
RUN npm install express-session@1.17.3
RUN npm install express@4.18.2
RUN npm install mocha@10.2.0
RUN npm install multer@1.4.5-lts.1
RUN npm install sqlite3@5.1.6

COPY . .

WORKDIR /usr/src/app

COPY --from=build /usr/src/app .

RUN apt-get update && apt-get install -y nodejs

EXPOSE 5501

CMD [ "node", "server.js" ]