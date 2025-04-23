# Use Node.js 18 Alpine image for a smaller footprint
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Install dependencies from package.json and package-lock.json
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Environment variables (you can pass them via docker-compose or an .env file)
ENV PORT=${PORT}
ENV GITLAB_API_URL=${GITLAB_API_URL}
ENV GITLAB_PROJECT_ID=${GITLAB_PROJECT_ID}
ENV GITLAB_ACCESS_TOKEN=${GITLAB_ACCESS_TOKEN}
ENV GITLAB_PIPELINE_TRIGGER_TOKEN=${GITLAB_PIPELINE_TRIGGER_TOKEN}
ENV GITLAB_PUBLIC_YML_ACCESS_TOKEN=${PUBLIC_YML_ACCESS_TOKEN}

# Expose the application port
EXPOSE ${PORT}

# Start command
CMD ["npm", "start"]
