FROM node:16.13.2-alpine3.15

# Set working dir to /app
WORKDIR /app

COPY package*.json ./
ENV NODE_PATH=/node_modules
ENV PATH=$PATH:/node_modules/.bin
RUN npm ci

# Add project files to /app route in Container
ADD . /app

# expose port 3000
EXPOSE 3000
