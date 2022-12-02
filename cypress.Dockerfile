# install stage
# FROM cypress/base:16.14.2 as install-stage
FROM cypress/included:10.11.0 as install-stage
# FROM cypress/browsers:latest as install-stage
# Lower than Chrome94 required to disable cookie secure setting when samesite is None
# FROM cypress/browsers:node14.16.0-chrome90-ff88 as install-stage
# FROM cypress/browsers:latest as install-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# RUN npx cypress install

# ENV CI=1

CMD [ "npm", "run", "test:e2e"]
