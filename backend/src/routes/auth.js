const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { authenticateJWT, authorizeRole } = require('../middlewares/authMiddleware');

router.post('/register', authenticateJWT, authorizeRole(['admin']), async (req, res) => {
    const { email, name, password, role } = req.body;
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
        return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    const user = await User.create({ email, name, password, role: role || 'user' });

    res.status(201).json({ message: 'Пользователь успешно зарегистрирован', user: {name, email, role: user.role} });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!email || !password) {
        return res.status(400).json({ message: 'Email и пароль обязательны' });
    }

    if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({ message: 'Неверный пароль' });
    }

    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
});
module.exports = router;
