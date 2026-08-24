FROM node:22-bookworm-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@11.9.0 --activate

WORKDIR /app


# 1. Obtener solamente la parte del monorepo que necesita Web
FROM base AS pruner

COPY . .

RUN pnpm dlx turbo@2.9.18 prune @notas-universitarias/web --docker


# 2. Instalar dependencias y construir TanStack Start
FROM base AS builder

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .

COPY tsconfig.base.json ./tsconfig.base.json

ARG VITE_API_URL
ARG VITE_INTERNAL_API_URL

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_INTERNAL_API_URL=$VITE_INTERNAL_API_URL

RUN pnpm --filter=@notas-universitarias/web build


# 3. Imagen final
FROM base AS runner

ENV NODE_ENV=production
ENV PORT=3987

WORKDIR /app

COPY --from=builder /app/apps/web/.output ./.output

EXPOSE 3987

CMD ["node", ".output/server/index.mjs"]