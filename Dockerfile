# Base image
FROM node:22


ARG JWT_SECRET
ENV JWT_SECRET=${JWT_SECRET}

ARG DB_HOST
ARG DB_PORT
ARG DB_USERNAME
ARG DB_PASSWORD
ARG DB_NAME
ARG SERVERPORT
ARG EMAIL_TRANSPORT_USER
ARG EMAIL_TRANSPORT_PASSWORD

ENV DB_HOST=${DB_HOST}
ENV DB_PORT=${DB_PORT}
ENV DB_USERNAME=${DB_USERNAME}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_NAME=${DB_NAME}
ENV SERVERPORT=${SERVERPORT}
ENV EMAIL_TRANSPORT_USER=${EMAIL_TRANSPORT_USER}
ENV EMAIL_TRANSPORT_PASSWORD=${EMAIL_TRANSPORT_PASSWORD}

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
