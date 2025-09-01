
#bulder dep
FROM node:20-alpine AS dep
WORKDIR /app
COPY package*.json ./
RUN npm ci


FROM  node:20-alpine AS builder
WORKDIR /app
COPY --from=dep /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS prod-dep
WORKDIR /app
COPY package*.json  ./
RUN npm ci --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist/ ./dist
COPY --from=prod-dep /app/node_modules ./node_modules
CMD [ "node","dist/main.js" ] 
