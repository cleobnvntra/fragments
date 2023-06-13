# FROM <base image>
FROM node:18:16.0

# LABEL <key=value>
LABEL maintainer="Cleo Buenaventura <cjbuenaventura@myseneca.ca>"
LABEL description="Fragments node.js microservice"

#default port
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# WORKDIR </dir name>
# Use /app as working directory
WORKDIR /app

# COPY <src> <dest>
# COPY package.json and package-lock.json
COPY package*.json /app/

# Install node dependencies defined in package-lock.json
RUN npm install

# Copy src to /app/src/
COPY ./src ./src

# Start the container by running our server
CMD npm start

# We run our service on port 8080
EXPOSE 8080
