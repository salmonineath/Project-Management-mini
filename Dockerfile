# ─── Base ────────────────────────────────────────────────────────────────────
FROM node:24-alpine AS base
WORKDIR /app

# ─── Development ─────────────────────────────────────────────────────────────
FROM base AS development
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npm", "run", "start:dev"]

# ─── Build ───────────────────────────────────────────────────────────────────
FROM base AS build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ─── Production ──────────────────────────────────────────────────────────────
FROM base AS production
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]
