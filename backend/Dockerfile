# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /app
COPY . /app

# Install app dependencies
RUN yarn install

RUN yarn global add prisma


EXPOSE 8000
