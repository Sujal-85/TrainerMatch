# Use Node.js 20 slim as base image
FROM node:20-slim

# Set working directory
WORKDIR /app

ENV PUPPETEER_SKIP_DOWNLOAD=true

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]
