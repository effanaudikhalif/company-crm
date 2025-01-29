# Dockerfile

# Use the official Node.js image for building
FROM node:20 as builder

# Set the working directory
WORKDIR /app/front

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the entire project to the working directory
COPY . .

# copy environment file to container
ARG VITE_BACKEND_URL
RUN echo $VITE_BACKEND_URL
RUN echo "VITE_BACKEND_URL=\"$VITE_BACKEND_URL\"" > .env.production

RUN cat .env.production

# Build the Vite app
RUN npm run build

# Use the official NGINX image for serving
FROM nginx:1.24-alpine

# Copy the built app from the builder stage to the NGINX HTML directory
COPY --from=builder app/front/dist /usr/share/nginx/html

# Copy the NGINX configuration file to replace the default configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
