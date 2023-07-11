# Stage 1: Build stage
FROM node:18.12.0@sha256:cef9966b19672effeafcf1a67b8add742c3e46ca7dd5532efff60820526c2e95 AS build

# LABEL <key=value>
LABEL maintainer="Cleo Buenaventura <cjbuenaventura@myseneca.ca>"
LABEL description="Fragments node.js microservice"

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
FROM node:alpine@sha256:d5b2a7869a4016b1847986ea52098fa404421e44281bb7615a9e3615e07f37fb

# Use /app as the working directory
WORKDIR /app

# Copy dependencies from the build stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./

# Copy source files to image
COPY ./src ./src
COPY ./.env ./.env
COPY ./env.jest ./env.jest

# Start the container by running our server
CMD ["node", "src/index.js"]

# Expose the port
EXPOSE 8080
