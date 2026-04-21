const router = require('express').Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const verify = require('../middleware/verifyToken');

const calculateStreak = (completedDates) => {
    if (!completedDates || completedDates.length === 0) return 0;
    const datesSet = new Set(completedDates);
    let streak = 0; 
    let currentDate = new Date(); 
    let dateStr = currentDate.toISOString().split('T')[0];
    
    if (datesSet.has(dateStr)) { 
        streak++; 
        currentDate.setDate(currentDate.getDate() - 1); 
    } else {
        currentDate.setDate(currentDate.getDate() - 1); 
        dateStr = currentDate.toISOString().split('T')[0];
        if (datesSet.has(dateStr)) { 
            streak++; 
            currentDate.setDate(currentDate.getDate() - 1); 
        } else { 
            return 0; 
        }
    }
    while (true) {
        dateStr = currentDate.toISOString().split('T')[0];
        if (datesSet.has(dateStr)) { 
            streak++; 
            currentDate.setDate(currentDate.getDate() - 1); 
        } else { 
            break; 
        }
    }
    return streak;
};

router.post('/suggest', verify, async (req, res) => {
    try {
        const { habits } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.json({ 
                advice: "ШІ тимчасово відпочиває (перевірте API ключ). Але пам'ятай: головне — не розривати ланцюжок! 🔥" 
            });
        }

        const today = new Date().toISOString().split('T')[0];
        let habitsContext = "У користувача поки немає створених звичок.";

        if (habits && habits.length > 0) {
            habitsContext = habits.map(h => {
                const currentStreak = calculateStreak(h.completedDates);
                const isDoneToday = h.completedDates?.includes(today);
                const reminder = h.reminderTime ? `Нагадування о ${h.reminderTime}` : "Без нагадування";
                
                return `- "${h.title}": Поточна серія: ${currentStreak} днів поспіль. Сьогодні: ${isDoneToday ? 'Виконано' : 'НЕ виконано'}. ${reminder}.`;
            }).join('\n');
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
Ти — емпатичний, але цілеспрямований професійний тренер з продуктивності. 
Ось поточна статистика звичок твого клієнта, де головний показник — це безперервна серія днів (streak):

${habitsContext}

Твоє завдання: Дати 1 конкретну, мотиваційну та коротку пораду (максимум 3-4 речення) українською мовою.

ПРАВИЛА АНАЛІЗУ:
- Якщо є звички з довгою серією (більше 3-5 днів), які сьогодні ще НЕ виконані: терміново нагадай, як важливо не розірвати цей ланцюжок сьогодні!
- Якщо серія перервалася (0 днів): підтримай клієнта. Скажи, що пропускати дні — це нормально, головне не пропускати два дні поспіль.
- Якщо клієнт має довгу серію і сьогодні вже виконав звичку: похвали його стабільність.
- Якщо звичок немає: запропонуй 1 просту звичку для старту.

ВАЖЛИВО: Пиши одразу пораду. Без вступних фраз ("Привіт", "Ось моя порада"). Звертайся на "ти", використовуй емодзі для підтримки.
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        res.json({ advice: text });
    } catch (error) {
        console.error("Помилка ШІ:", error);
        res.status(500).json({ error: "Не вдалося зв'язатися з ШІ-асистентом. Спробуйте пізніше." });
    }
});

module.exports = router;