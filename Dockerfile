# Stage 1: Build stage
FROM node:18.16.0 AS build

# LABEL <key=value>
LABEL maintainer="Cleo Buenaventura <cjbuenaventura@myseneca.ca>" \
      description="Fragments node.js microservice"

# Set NODE_ENV to production
ENV NODE_ENV=production \
    # Default port
    PORT=8080 \
    # Reduce npm spam when installing within Docker
    NPM_CONFIG_LOGLEVEL=warn \
    # Disable color when run inside Docker
    NPM_CONFIG_COLOR=false

# Use /app as the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json /app/

# Install production dependencies only
RUN npm ci --only=production

# Stage 2: Production stage
FROM node:alpine

# Set NODE_ENV to production
ENV NODE_ENV=production \
    # Default port
    PORT=8080 \
    # Reduce npm spam when installing within Docker
    NPM_CONFIG_LOGLEVEL=warn \
    # Disable color when run inside Docker
    NPM_CONFIG_COLOR=false

# Use /app as the working directory
WORKDIR /app

# Copy dependencies from the build stage
COPY  --from=build /app/node_modules ./node_modules \
      --from=build /app/package*.json ./

# Copy src to /app/src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Start the container by running our server
CMD ["node", "src/index.js"]

# Expose the port
EXPOSE 8080
