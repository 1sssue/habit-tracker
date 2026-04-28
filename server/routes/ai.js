const router = require('express').Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const verify = require('../middleware/verifyToken');

const checkDateStr = (dateObj) => {
    const d = new Date(dateObj);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
};

const isDayRequired = (dateObj, habit) => {
    if (!habit) return false;
    if (habit.frequency === 'daily') return true;
    if (habit.frequency === 'weekly') return dateObj.getDay().toString() === habit.weeklyDay;
    if (habit.frequency === 'monthly') return dateObj.getDate().toString() === habit.monthlyDay;
    if (habit.frequency === 'specific_days') return habit.specificDays.includes(dateObj.getDay());
    if (habit.frequency === 'once') return checkDateStr(dateObj) === habit.reminderDate;
    return true;
};

const calculateStreak = (habit) => {
    if (!habit.completedDates || habit.completedDates.length === 0) return 0;
    
    const datesSet = new Set(habit.completedDates);
    let streak = 0;
    
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const todayStr = checkDateStr(currentDate);

    while (true) {
        if (!isDayRequired(currentDate, habit)) {
            currentDate.setDate(currentDate.getDate() - 1);
            continue; 
        }

        let loopDateStr = checkDateStr(currentDate);
        
        if (datesSet.has(loopDateStr)) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            if (loopDateStr === todayStr) {
                currentDate.setDate(currentDate.getDate() - 1);
                continue;
            } else {
                break; 
            }
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

        const todayObj = new Date();
        const todayStr = checkDateStr(todayObj);
        let habitsContext = "У користувача поки немає створених звичок.";

        if (habits && habits.length > 0) {
            habitsContext = habits.map(h => {
                const currentStreak = calculateStreak(h);
                const isDoneToday = h.completedDates?.includes(todayStr);
                const isRequiredToday = isDayRequired(todayObj, h);
                const reminder = h.reminderTime ? `Нагадування о ${h.reminderTime}` : "Без нагадування";
                
                let statusStr = "";
                if (isRequiredToday) {
                    statusStr = isDoneToday ? 'Виконано' : 'НЕ виконано (ОБОВ\'ЯЗКОВО зробити сьогодні)';
                } else {
                    statusStr = 'Сьогодні вихідний (виконувати не потрібно)';
                }
                
                return `- "${h.title}": Поточна серія: ${currentStreak} разів підряд. Статус на сьогодні: ${statusStr}. ${reminder}.`;
            }).join('\n');
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
Ти — емпатичний, але цілеспрямований професійний тренер з продуктивності. 
Ось поточна статистика звичок твого клієнта, де головний показник — це безперервна серія (streak):

${habitsContext}

Твоє завдання: Дати 1 конкретну, мотиваційну та коротку пораду (максимум 3-4 речення) українською мовою.

ПРАВИЛА АНАЛІЗУ:
- Якщо є звички з довгою серією, які ОБОВ'ЯЗКОВО треба зробити сьогодні, але вони ще НЕ виконані: терміново нагадай, як важливо не розірвати цей ланцюжок сьогодні!
- ІГНОРУЙ звички зі статусом "Сьогодні вихідний". НЕ нагадуй про них і НЕ кажи, що вони не виконані.
- Якщо серія перервалася (0 днів): підтримай клієнта. Скажи, що помилятися — це нормально, головне повертатися до роботи.
- Якщо клієнт має довгу серію і сьогодні вже виконав потрібні звички: похвали його стабільність.
- Якщо звичок немає: запропонуй 1 просту звичку для старту.

ВАЖЛИВО: Пиши одразу пораду. Без вступних фраз ("Привіт", "Ось моя порада"). Звертайся на "ти", використовуй емодзі для підтримки.
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        res.json({ advice: text });
    } catch (error) {
        console.error("Помилка ШІ:", error);
        
        if (error.status === 503 || (error.message && error.message.includes("503"))) {
            return res.status(503).json({ error: "Сервери Google (Gemini) зараз перевантажені запитами з усього світу. Зачекайте хвилинку і спробуйте ще раз! ⏳" });
        }

        res.status(500).json({ error: "Не вдалося зв'язатися з ШІ-асистентом. Спробуйте пізніше." });
    }
});

router.post('/breakdown', verify, async (req, res) => {
    try {
        const { goal } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.status(400).json({ error: "Немає API ключа" });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Ти експерт з продуктивності. Клієнт хоче досягти цілі: "${goal}".
        Навіть якщо запит дуже короткий (1-2 слова, наприклад "спорт", "читати", "вода", "англійська"), самостійно додумай логічний контекст і розбий цю ціль на 3-5 щоденних мікро-звичок. 
        
        ВІДПОВІДАЙ ВИКЛЮЧНО ВАЛІДНИМ JSON-МАСИВОМ! Без жодних привітань, пояснень чи форматування.
        Формат має бути строго таким: 
        [
          {"title": "Назва звички", "description": "Коротка деталь (1 речення)", "reminderTime": "08:00"}
        ]`;

        const result = await model.generateContent(prompt);
        let text = result.response.text().trim();
        
        const match = text.match(/\[[\s\S]*\]/);
        
        if (!match) {
            throw new Error("AI response didn't contain a valid JSON array");
        }
        
        const habits = JSON.parse(match[0]); 
        res.json(habits);
    } catch (error) {
        console.error("Помилка генерації мікро-звичок:", error);
        
        if (error.status === 503 || (error.message && error.message.includes("503"))) {
            return res.status(503).json({ error: "Сервери Google зараз перевантажені. Зачекайте хвилинку і спробуйте ще раз! ⏳" });
        }

        if (error.status === 429 || (error.message && error.message.includes("429"))) {
            return res.status(429).json({ error: "ШІ трохи втомився від кількості запитів 😅. Зачекайте хвилину і натисніть кнопку знову!" });
        }

        res.status(500).json({ error: "ШІ не зміг розібрати ціль. Спробуй написати трохи детальніше (наприклад, 'почати бігати' замість 'біг')." });
    }
});

module.exports = router;