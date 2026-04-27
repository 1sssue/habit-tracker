const router = require('express').Router();
const webpush = require('web-push');
const User = require('../models/User');
const verify = require('../middleware/verifyToken');

webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

router.get('/vapid-public-key', (req, res) => {
    res.send(process.env.VAPID_PUBLIC_KEY);
});

router.post('/subscribe', verify, async (req, res) => {
    try {
        const subscription = req.body;
        await User.findByIdAndUpdate(req.user._id, { pushSubscription: subscription });
        res.status(201).json({ message: "Підписка на пуш успішна!" });
    } catch (error) {
        console.error("Помилка підписки:", error);
        res.status(500).json({ error: "Не вдалося зберегти підписку" });
    }
});

router.post('/test', verify, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user.pushSubscription) return res.status(400).json({ error: "Немає підписки" });

        const payload = JSON.stringify({
            title: 'Habit Tracker',
            body: 'Пуш-сповіщення успішно налаштовані! 🚀',
            icon: '/icon-192x192.png'
        });

        await webpush.sendNotification(user.pushSubscription, payload);
        res.status(200).json({ message: "Тест відправлено" });
    } catch (error) {
        res.status(500).json({ error: "Помилка відправки" });
    }
});

module.exports = router;