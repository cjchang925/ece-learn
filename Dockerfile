FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# The built files are in /app/build; docker-compose copies them to nginx/html
# via: cp -r /app/build/* /output/
