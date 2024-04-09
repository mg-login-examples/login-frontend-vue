# install stage
FROM node:20.9-slim as base-stage
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY package.json pnpm-lock.yaml ./

FROM base-stage as all-deps-stage
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM base-stage AS prod-deps-stage
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM all-deps-stage AS build-stage
RUN pnpm run build:prod

FROM all-deps-stage as build-dev-watch-stage
COPY . .

# # Add Git to run tests with '--watch' flag
# RUN apk update
# RUN apk add git

EXPOSE 5173
ARG VITE_APP_BACKEND_URL
ENV VITE_APP_BACKEND_URL $VITE_APP_BACKEND_URL
ARG VITE_APP_BACKEND_WEBSOCKET_URL
ENV VITE_APP_BACKEND_WEBSOCKET_URL $VITE_APP_BACKEND_WEBSOCKET_URL
ARG VITE_LOG_ENV_VARS
ENV VITE_LOG_ENV_VARS $VITE_LOG_ENV_VARS
CMD [ "npm", "run", "build-dev-watch" ]


# build production stage
FROM base-stage as prod-stage
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
ARG VITE_MODE=production
EXPOSE 8000
CMD [ "pnpm", "start" ]



# production stage
FROM nginx:stable-alpine as serve-nginx-stage
COPY --from=build /app/dist  /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]