FROM node:22.12.0
WORKDIR /app
COPY ./package*.json ./ 
RUN npm install
RUN npm install -g nodemon
COPY ./ ./
EXPOSE 4244
CMD ["npm", "run", "test"]