# Etapa de build
FROM node:22-alpine AS builder

WORKDIR /app
COPY proto ./
COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

# Etapa de producción
FROM node:22-alpine
WORKDIR /app
COPY proto ./
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist
COPY proto ./proto
EXPOSE 3000
CMD ["node", "dist/main.js"]
