#1 Build the api
FROM node:22-alpine AS api-builder
WORKDIR /app
COPY shortener-api/package.json shortener-api/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY shortener-api .
RUN yarn build

#2 Build the client
FROM node:22-alpine AS client-builder
WORKDIR /client
COPY shortener-client/package.json shortener-client/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY shortener-client .
RUN yarn build

#3 Assemble finale image
FROM node:22-alpine
WORKDIR /app
COPY --from=api-builder /app .
COPY --from=client-builder /client/build ./public

EXPOSE 3000
CMD ["node", "dist/main.js"]