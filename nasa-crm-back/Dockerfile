# Use Alpine Linux as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app/back

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code to the container
COPY . .

# Generate Prisma client during the build
RUN npx prisma generate

# Expose the port that your Express app will run on
EXPOSE 443

# Run the application
CMD ["node", "index"]
