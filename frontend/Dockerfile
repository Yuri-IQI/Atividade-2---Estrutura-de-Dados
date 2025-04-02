FROM node:lts-alpine AS build-stage
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run generate

FROM nginx:stable-alpine AS production-stage
WORKDIR /usr/share/nginx/html

COPY --from=build-stage /app/.output/public .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]