# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy remaining source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port (adjust if using a different port)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
