# Use an official Node runtime as a parent image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# install git
# install docker

# Install any dependencies
COPY package*.json ./
RUN npm install

COPY . .

ENV PORT=3003

EXPOSE 3003

CMD ["node", "server.js"]