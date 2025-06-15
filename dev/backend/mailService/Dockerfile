FROM node:22.12.0

WORKDIR /app

COPY ./package*.json ./
RUN npm install
RUN npm install -g pm2

COPY ./ ./

EXPOSE 4244

CMD ["pm2-runtime", "index.js"]