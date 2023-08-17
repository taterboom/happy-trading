FROM node:18-alpine AS base

FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
RUN npm install -g pnpm@7.3.0
RUN npm install -g turbo
COPY . .
RUN pnpm install --frozen-lockfile
RUN npx turbo run build --filter=happy-trading-server

FROM base AS runner
WORKDIR /app
COPY --from=installer ./app .

CMD ["node", "apps/happy-trading-server/dist/index.js"]
