FROM node:22-alpine

RUN apk add --no-cache curl bash

WORKDIR /app

RUN curl -o /usr/local/bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh && \
    chmod +x /usr/local/bin/wait-for-it.sh

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "wait-for-it.sh pypipe-db:5432 -- npm start"]