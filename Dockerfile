# Use Node.js 22 Alpine image for a smaller footprint
FROM node:22-alpine

# Install curl for fetching wait-for-it.sh
RUN apk add --no-cache curl bash

# Set the working directory
WORKDIR /app

# Install wait-for-it script
RUN curl -o /usr/local/bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh && \
    chmod +x /usr/local/bin/wait-for-it.sh

# Install dependencies from package.json and package-lock.json
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Environment variables (still passed via Docker Compose or an .env file)
ENV PORT=${PORT}
ENV DATABASE_URL=${DATABASE_URL}
ENV GITLAB_BASE_URL=${GITLAB_BASE_URL}
ENV GITLAB_PROJECT_ID=${GITLAB_PROJECT_ID}
ENV GITLAB_ACCESS_TOKEN=${GITLAB_ACCESS_TOKEN}
ENV GITLAB_PIPELINE_TRIGGER_TOKEN=${GITLAB_PIPELINE_TRIGGER_TOKEN}
ENV GITLAB_PUBLIC_YML_ACCESS_TOKEN=${PUBLIC_YML_ACCESS_TOKEN}

# Expose the application port
EXPOSE ${PORT}

# Wait for the DB before starting the app
CMD ["sh", "-c", "wait-for-it.sh pypipe-db:5432 -- npm start"]