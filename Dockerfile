FROM node:20 AS builder

RUN npm install -g pnpm
# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY src ./src/

COPY .env.test ./src/.env
COPY prisma ./prisma/

# Install app dependencies
RUN pnpm install

COPY . .

RUN pnpm run db:generate
RUN pnpm run db:deploy
RUN pnpm run build

FROM node:20

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

EXPOSE 3001
CMD [ "yarn", "run", "start:prod" ]