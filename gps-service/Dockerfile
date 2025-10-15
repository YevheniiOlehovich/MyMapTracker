# Базовий образ Node.js
FROM node:20

# Робоча директорія всередині контейнера
WORKDIR /app

# Копіюємо package.json і package-lock.json
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо весь код сервісу
COPY . .

# Відкриваємо порт для GPS-сервісу
EXPOSE 20120

# Команда запуску сервісу
CMD ["node", "index.js"]
