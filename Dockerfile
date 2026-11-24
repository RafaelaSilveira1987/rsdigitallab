# Build reprodutível para EasyPanel / TanStack Start.
# Node 24.22.2 inclui npm 11.x, evitando o crash "edgesOut" do npm 10.x.
FROM node:24.22.2-bookworm-slim AS build
WORKDIR /app

# Inclui o lockfile para instalar exatamente as versões homologadas pelo projeto.
COPY package.json package-lock.json ./
RUN npm --version && npm ci --include=dev --no-audit --no-fund

COPY . .
ENV NITRO_PRESET=node-server
RUN npm run build

FROM node:24.22.2-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
COPY --from=build /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
