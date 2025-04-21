
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Environment variables
ENV PORT=${PORT}
ENV GITLAB_API_URL=${GITLAB_API_URL}
ENV GITLAB_PROJECT_ID=${GITLAB_PROJECT_ID}
ENV GITLAB_ACCESS_TOKEN=${GITLAB_ACCESS_TOKEN}
ENV GITLAB_PIPELINE_TRIGGER_TOKEN=${GITLAB_PIPELINE_TRIGGER_TOKEN}

# Expose port
EXPOSE ${PORT}

# Start command
CMD ["npm", "start"]