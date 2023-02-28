FROM mcr.microsoft.com/playwright:v1.28.0 as install-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx playwright install --with-deps


CMD [ "npm", "run", "test:e2e:playwright"]
