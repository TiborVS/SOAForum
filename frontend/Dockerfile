FROM node:22-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY vite.config.js style.css index.html ./
COPY src ./src/
COPY server ./server/

ARG VITE_USER_SERVICE_LOCATION=http://localhost:3000
ARG VITE_POST_SERVICE_LOCATION=http://localhost:3001
ARG VITE_THREAD_SERVICE_LOCATION=http://localhost:3003
ARG VITE_FILE_SERVICE_LOCATION=http://localhost:3002
ARG PORT=4000

EXPOSE $PORT

RUN ["npm", "run", "build"]

WORKDIR /app/server
RUN npm ci

ENV PORT=$PORT
CMD ["npm", "run", "start"]
