# install stage
FROM node:16.14-alpine as install-stage

RUN apk --update --no-cache add wget

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# # Add Git to run tests with '--watch' flag
# RUN apk update
# RUN apk add git

# serve stage
FROM install-stage as serve-local-stage
EXPOSE 5173
ARG VITE_APP_BACKEND_URL
ENV VITE_APP_BACKEND_URL $VITE_APP_BACKEND_URL
ARG VITE_APP_BACKEND_WEBSOCKET_URL
ENV VITE_APP_BACKEND_WEBSOCKET_URL $VITE_APP_BACKEND_WEBSOCKET_URL
CMD [ "npm", "run", "dev" ]

# build stage
FROM install-stage as build-stage
ARG VITE_MODE=production
RUN npx vite build --mode VITE_MODE

# production stage
FROM nginx:stable-alpine as serve-static-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
