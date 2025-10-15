# 1. Build stage: збірка фронтенду
FROM node:20 as build

WORKDIR /app

# Копіюємо package.json і package-lock.json та встановлюємо залежності
COPY package*.json ./
RUN npm install

# Копіюємо весь код фронтенду
COPY . .

# Створюємо production build
RUN npm run build

# 2. Nginx stage: хостинг фронтенду
FROM nginx:alpine

# Копіюємо збірку фронтенду з попереднього етапу
COPY --from=build /app/dist /usr/share/nginx/html

# Мапимо папку uploads
COPY ../uploads /usr/share/nginx/html/uploads

# Копіюємо кастомний конфіг Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Відкриваємо порт 80
EXPOSE 80

# Запуск Nginx
CMD ["nginx", "-g", "daemon off;"]
