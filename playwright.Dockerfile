FROM node:20-bookworm as install-stage
RUN npx -y playwright@1.43.0 install --with-deps
RUN npm -g install pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# RUN pnpm install
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .

RUN pnpm playwright install --with-deps

CMD [ "npm", "run", "test-e2e-playwright"]
