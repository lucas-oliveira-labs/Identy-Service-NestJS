FROM node:22-slim

ENV NODE_ENV=development

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 7000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:dev"]
