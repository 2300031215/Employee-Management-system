# Backend Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy server files
COPY server ./server

# Expose backend port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
