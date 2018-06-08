FROM node:latest
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install dependencies
COPY package.json /usr/src/app/
COPY package-lock.json /usr/src/app/
RUN npm install

# COPY Source files and Webpack build
COPY ./utils /usr/src/app/utils
COPY ./src /usr/src/app/src
COPY ./static /usr/src/app/static
COPY ./routes /usr/src/app/routes
COPY *.js /usr/src/app/
RUN npm run build:prod

EXPOSE 3000

# FUN FACT: DO NOT RUN ["npm", "start"] as the ENTRYPOINT
# It does not forward the SIGTERM and SIGINT events to Node
ENTRYPOINT [ "node", "server.js" ]
