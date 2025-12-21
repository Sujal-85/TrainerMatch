# Use Node.js 20 full as base image
FROM node:20

# Install OpenSSL
RUN apt-get update -y && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

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
