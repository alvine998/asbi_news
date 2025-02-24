# Use Node.js as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the app
COPY . .

# Copy environment variables
COPY .env.local .env.local

# Build the Next.js app
RUN npm run build

# Expose port 3000
EXPOSE 3005

# Start the Next.js app
CMD ["npm", "start"]

