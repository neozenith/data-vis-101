########################################
# BUILDER
########################################
FROM node:10-alpine AS build 
MAINTAINER Josh Peak <neozenith.dev@gmail.com>

ENV INSTALL_PATH /usr/src/app
RUN mkdir -p $INSTALL_PATH
WORKDIR $INSTALL_PATH

# Install dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install

# COPY Source files and Webpack build
#COPY Frontend code and static assets and Webpack build
COPY ./webpack.config.js .
COPY ./src ./src
COPY ./static ./static
RUN npm run build:prod

########################################
# PRODUCTION
########################################
FROM node:10-alpine
ENV INSTALL_PATH /usr/src/app
RUN mkdir -p $INSTALL_PATH
WORKDIR $INSTALL_PATH 

COPY package.json .
COPY package-lock.json .
RUN npm install --only=production

COPY --from=build $INSTALL_PATH/dist ./dist 
# RUN ls -lah ./dist/
# COPY rest of code
# NOTE: .dockerignore file reduces the scope of what gets copied here
COPY . . 
# RUN ls -lah

EXPOSE 3000

# FUN FACT: DO NOT RUN ["npm", "start"] as the ENTRYPOINT
# It does not forward the SIGTERM and SIGINT events to Node
ENTRYPOINT [ "node", "server.js" ]
