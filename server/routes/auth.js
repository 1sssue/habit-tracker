const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

router.post('/register', async (req, res) => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(req.body.password)) {
        return res.status(400).json({ message: "Пароль має містити мінімум 6 символів, включаючи літери та цифри." });
    }

    try {
        const { username, email, password } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
        });

        const user = await newUser.save();

        await sendEmail(
            user.email, 
            "Вітаємо в Habit Tracker!", 
            "Твій акаунт успішно створено. Почни будувати корисні звички вже сьогодні!"
        );

        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json("Користувача не знайдено!");

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).json("Невірний пароль!");

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, token });

    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/forgot-password', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: "Користувача з таким email не знайдено." });
        }

        const secret = process.env.JWT_SECRET + user.password;
        
        const token = jwt.sign({ email: user.email, id: user._id }, secret, { expiresIn: '15m' });

        const link = `https://habit-tracker-ten-sepia.vercel.app/reset-password/${user._id}/${token}`;

        await sendEmail(
            user.email,
            "Відновлення пароля - Habit Tracker",
            `Привіт! Ми отримали запит на скидання пароля.\n\nПерейди за цим посиланням, щоб встановити новий пароль (посилання дійсне 15 хвилин):\n${link}\n\nЯкщо ти не робив цей запит, просто проігноруй цей лист.`
        );

        res.status(200).json({ message: "Лист для відновлення пароля відправлено!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Помилка сервера при спробі відправити лист." });
    }
});

router.post('/reset-password/:id/:token', async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: "Пароль має містити мінімум 6 символів, включаючи літери та цифри." });
    }

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "Користувача не знайдено." });

        const secret = process.env.JWT_SECRET + user.password;
        try {
            jwt.verify(token, secret);
        } catch (error) {
            return res.status(400).json({ message: "Посилання недійсне або його час дії (15 хв) минув!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Пароль успішно змінено!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Помилка сервера при спробі змінити пароль." });
    }
});

module.exports = router;