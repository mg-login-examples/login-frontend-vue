# install stage
FROM cypress/included:13.8.0 as install-stage
RUN npm -g install pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# RUN pnpm install
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .
# RUN npx cypress install

# ENV CI=1

CMD [ "pnpm", "run", "test-e2e-cypress"]
