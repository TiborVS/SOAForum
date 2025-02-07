FROM node:22-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY bin ./bin/
COPY models ./models/
COPY routes ./routes/
COPY app.js ./

ENV PORT=3002
EXPOSE $PORT

CMD ["npm", "run", "start"]
