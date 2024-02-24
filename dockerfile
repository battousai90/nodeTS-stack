FROM node:18

# Install pnpm
RUN npm i -g pnpm

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

# Bundle app source
COPY . .

# Build app
EXPOSE 8080
CMD [ "pnpm", "start" ]
