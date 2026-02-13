# Базовий образ Node.js
FROM node:20

# Робоча директорія
WORKDIR /app

# Копіюємо package.json
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо код
COPY . .

# Відкриваємо порт метеостанції
EXPOSE 20220

# Запуск
CMD ["npm", "start"]
