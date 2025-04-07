import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const router = express.Router();

// Схема користувача
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Модель користувача
const User = mongoose.model('User', userSchema);

// Middleware для перевірки токена
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Токен відсутній' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Токен недійсний' });
        }

        req.user = user;
        next();
    });
}

// Реєстрація користувача
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Ім\'я користувача та пароль обов\'язкові' });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Користувач вже існує' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Користувач зареєстрований' });
    } catch (error) {
        console.error('Помилка:', error);
        res.status(500).json({ message: 'Помилка сервера', error });
    }
});

// Логін користувача
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'Користувача не знайдено' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Невірний пароль' });
        }

        const token = jwt.sign({ id: user._id, username }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        res.json({ token });
    } catch (error) {
        console.error('Помилка:', error);
        res.status(500).json({ message: 'Помилка сервера', error });
    }
});

// Захищений маршрут
router.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Це захищений маршрут', user: req.user });
});

export default router;