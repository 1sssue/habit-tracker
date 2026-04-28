const router = require('express').Router();
const User = require('../models/User');
const Habit = require('../models/Habit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

const verifyToken = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).json("Доступ заборонено");
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) { res.status(400).json("Недійсний токен"); }
};

router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        const habits = await Habit.find({ userId: req.user._id });
        
        let totalCompletions = 0;
        habits.forEach(h => totalCompletions += h.completedDates.length);

        const level = Math.floor(totalCompletions / 10) + 1;
        const currentExp = totalCompletions % 10; 
        const expToNextLevel = 10;

        let title = "Новачок";
        if (level >= 5) title = "Досвідчений трекер";
        if (level >= 10) title = "Майстер звичок";
        if (level >= 20) title = "Легенда продуктивності";

        res.status(200).json({ 
            ...user._doc, 
            stats: { totalCompletions, level, currentExp, expToNextLevel, title, totalHabits: habits.length } 
        });
    } catch (err) { res.status(500).json(err); }
});

router.put('/update', verifyToken, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: { username: req.body.username, avatar: req.body.avatar } },
            { new: true }
        ).select('-password');
        res.status(200).json(updatedUser);
    } catch (err) { res.status(500).json(err); }
});

router.post('/request-security-change', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const { newEmail, newPassword } = req.body;

        if (newPassword) {
            const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;
            if (!passwordRegex.test(newPassword)) {
                return res.status(400).json({ message: "Пароль має містити мінімум 6 символів (літери та цифри)." });
            }
        }

        const payload = { id: user._id, newEmail, newPassword };
        const actionToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10m' });

        const link = `https://habit-tracker-ten-sepia.vercel.app/profile?actionToken=${actionToken}`;
        
        await sendEmail(
            user.email,
            "Підтвердження змін у профілі - Habit Tracker",
            `Привіт!\n\nХтось (сподіваємось, це ти) запросив зміну налаштувань безпеки профілю.\n\nДля підтвердження перейди за посиланням (діє 10 хвилин):\n${link}\n\nЯкщо це був не ти, негайно зміни пароль!`
        );

        res.status(200).json({ message: "Лист для підтвердження надіслано на вашу поточну пошту." });
    } catch (err) { res.status(500).json(err); }
});

router.post('/confirm-security-change', async (req, res) => {
    try {
        const { token } = req.body;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: "Користувача не знайдено." });

        if (decoded.newEmail) user.email = decoded.newEmail;
        if (decoded.newPassword) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(decoded.newPassword, salt);
        }

        await user.save();
        res.status(200).json({ message: "Дані безпеки успішно оновлено!" });
    } catch (err) {
        res.status(400).json({ message: "Посилання недійсне або його час дії минув." });
    }
});

module.exports = router;