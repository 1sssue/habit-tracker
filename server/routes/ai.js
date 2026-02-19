const router = require('express').Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const verify = require('../middleware/verifyToken');

router.post('/suggest', verify, async (req, res) => {
    try {
        const { habits } = req.body;
        
        const habitTitles = habits.map(h => h.title).join(', ');

        if (!process.env.GEMINI_API_KEY) {
            return res.json({ 
                advice: `Штучний інтелект поки відпочиває (немає API ключа). Але ось моя порада для твоїх звичок (${habitTitles || 'яких поки немає'}): продовжуй в тому ж дусі, ти молодець! ✨` 
            });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Уяви, що ти мотиваційний тренер. Твій клієнт має такі звички: ${habitTitles || 'Поки немає звичок'}. Дай йому дуже коротку, позитивну пораду (2-3 речення) українською мовою, як їх покращити або що додати. Без зайвих вступів.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        res.json({ advice: text });
    } catch (error) {
        console.error("Помилка ШІ:", error);
        res.status(500).json({ error: "Не вдалося отримати пораду від ШІ" });
    }
});

module.exports = router;