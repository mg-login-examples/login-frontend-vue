# install stage
FROM node:20.12-slim as base-stage
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apt-get update && apt-get install -y wget

WORKDIR /app
COPY package.json pnpm-lock.yaml ./

FROM base-stage as all-deps-stage
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM base-stage AS prod-deps-stage
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM all-deps-stage as serve-stage
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

CMD [ "pnpm", "run", "dev" ]


FROM all-deps-stage AS build-prod-stage
COPY . .

ARG VITE_MODE=production
RUN pnpm run build-prod

# production stage
FROM nginx:stable-alpine as serve-nginx-stage
COPY --from=build-prod-stage /app/dist  /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]