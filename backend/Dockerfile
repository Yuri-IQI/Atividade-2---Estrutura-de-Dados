FROM node:lts-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .  
EXPOSE 4500
CMD ["node", "./server.js"]