# Stage 1: Build Stage
FROM node:18 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY .. .

# Compile TypeScript to JavaScript
RUN npm run build

# List the contents of the dist directory to verify the build
RUN ls -la /app/dist

# Stage 2: Production Stage
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Expose the port that the app listens on
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/server.js"]