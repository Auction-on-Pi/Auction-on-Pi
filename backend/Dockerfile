FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy app source
COPY ./src ./src
COPY ./tsconfig.json ./tsconfig.json

# Build the app
RUN yarn build

# Install PM2 for managing processes
RUN yarn global add pm2
COPY ./docker/processes.config.js ./processes.config.js

# Expose port and define runtime command
EXPOSE 8080
CMD [ "pm2-runtime", "./processes.config.js" ]
