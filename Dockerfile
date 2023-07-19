FROM node:14-alpine
WORKDIR /opt/app
WORKDIR /data/db
ADD package.json package.json
RUN npm install --legacy-peer-deps
ADD . .
RUN npm run build
RUN npm prune --production
CMD ["node", "./dist/main.js"]