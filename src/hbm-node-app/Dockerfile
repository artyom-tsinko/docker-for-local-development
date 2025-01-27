# Compile TypeScript code

FROM node:22-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx tsc

# Build the final image

FROM node:22-alpine AS final

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]
