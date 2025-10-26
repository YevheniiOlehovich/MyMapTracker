# Базовий образ Node.js
FROM node:20

# Робоча директорія всередині контейнера
WORKDIR /app

# Копіюємо package.json і package-lock.json
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо весь код бекенду
COPY . .

# Копіюємо файл .env
# COPY .env .env

# Відкриваємо порт для Node.js
EXPOSE 5000

# Команда запуску бекенду
CMD ["node", "src/server.js"]
