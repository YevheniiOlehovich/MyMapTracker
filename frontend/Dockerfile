FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

CMD rm -rf /host_dist/* && cp -r dist/* /host_dist