FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

COPY dist/ ./dist/

ENV NODE_ENV=production
EXPOSE 3100

CMD ["node", "dist/server.js"]
