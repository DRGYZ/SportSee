FROM node:24-alpine

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY app ./app
COPY frontend/src/services/mock/demoData.json ./frontend/src/services/mock/demoData.json

EXPOSE 3000
CMD ["npm", "start"]
