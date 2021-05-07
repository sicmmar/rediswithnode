FROM node:latest
WORKDIR /usr/src/nodejs
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 7019

CMD ["node", "index.js"]
