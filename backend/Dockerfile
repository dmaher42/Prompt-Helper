FROM node:20-alpine AS base
WORKDIR /app

COPY package.json package-lock.json* tsconfig.json eslint.config.js vitest.config.ts ./
COPY src ./src
COPY src/db ./src/db

RUN npm install --include=dev \
    && npm run prisma:generate \
    && npm run build \
    && npm prune --production

FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY package.json ./package.json
ENV NODE_ENV=production
CMD ["node", "dist/server.js"]
