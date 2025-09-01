FROM node:20-alpine AS dep

WORKDIR /dep
COPY package*.json ./
RUN npm ci 

FROM node:20-alpine AS builder

WORKDIR /build
COPY --from=dep /dep/node_modules ./node_modules
COPY . .
RUN npm run build




FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /build/.next/standalone ./
COPY --from=builder /build/.next/static ./.next/static
COPY --from=builder /build/public ./public
CMD [ "node","server.js" ]






