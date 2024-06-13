FROM  node:20-slim as build-stage

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .

RUN npm install -g pnpm

RUN pnpm config set registry https://registry.npmmirror.com/

RUN pnpm install

COPY . .

RUN pnpm  build

# production stage
FROM node:20-slim as production-stage

COPY --from=build-stage /app/dist /app/dist
COPY --from=build-stage /app/prisma /app/prisma
COPY --from=build-stage /app/package.json /app/package.json
COPY --from=build-stage /app/pnpm-lock.yaml /app/pnpm-lock.yaml
COPY --from=build-stage /app/start.sh /app/start.sh

WORKDIR /app

# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install curl gnupg -y \
  && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install google-chrome-stable -y --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm

RUN pnpm config set registry https://registry.npmmirror.com/

RUN pnpm install --production

EXPOSE 3000

RUN chmod +x /app/start.sh

ENTRYPOINT './start.sh'