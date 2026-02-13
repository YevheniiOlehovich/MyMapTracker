# # 1. Build stage: збірка фронтенду
# FROM node:20 as build

# WORKDIR /app

# # Копіюємо package.json і package-lock.json та встановлюємо залежності
# COPY package*.json ./
# RUN npm install

# # Копіюємо весь код фронтенду
# COPY . .

# # Створюємо production build
# RUN npm run build

# # 2. Nginx stage: хостинг фронтенду
# FROM nginx:alpine

# # Копіюємо збірку фронтенду з попереднього етапу
# COPY --from=build /app/dist /usr/share/nginx/html

# # НЕ копіюємо uploads — буде змонтовано як volume
# # COPY ../uploads /usr/share/nginx/html/uploads  <- закоментовано / видалено

# # Копіюємо кастомний конфіг Nginx
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# # Відкриваємо порт 80
# EXPOSE 80

# # Запуск Nginx
# CMD ["nginx", "-g", "daemon off;"]







# # 1. Build stage: збірка фронтенду
# FROM node:20 as build

# WORKDIR /app

# # Копіюємо package.json і package-lock.json та встановлюємо залежності
# COPY package*.json ./
# RUN npm install

# # Копіюємо весь код фронтенду
# COPY . .

# # Створюємо production build
# RUN npm run build

# # 2. Final stage: просто build файли, без Nginx
# FROM alpine:3.18

# # WORKDIR /usr/share/nginx/html
# WORKDIR /app
# # Копіюємо збірку фронтенду з попереднього етапу
# # COPY --from=build /app/dist .
# COPY --from=build /app/dist ./dist
# # Не експортуємо порти
# # EXPOSE 80  <- видаляємо
# # CMD не потрібен, бо Nginx буде окремо


FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

CMD mkdir -p /host_dist && cp -r dist/* /host_dist
