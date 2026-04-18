const cron = require('node-cron');
const Habit = require('./models/Habit');
const User = require('./models/User');
const sendEmail = require('./utils/sendEmail');

const startCronJobs = () => {
    console.log("⏳ Планувальник нагадувань (Cron) запущено...");

    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date();
            
            const formatter = new Intl.DateTimeFormat('uk-UA', {
                timeZone: 'Europe/Kyiv', hour: '2-digit', minute: '2-digit', hour12: false
            });
            const currentTime = formatter.format(now);
            const today = now.toISOString().split('T')[0];

            const habits = await Habit.find({
                reminderTime: currentTime,
                completedDates: { $ne: today }
            });

            if (habits.length === 0) return;

            for (let habit of habits) {
                const user = await User.findById(habit.userId);
                if (user && user.email) {
                    await sendEmail(
                        user.email,
                        "⏰ Час для твоєї звички!",
                        `Привіт, ${user.username}!\n\nНагадуємо, що зараз час виконати твою звичку: "${habit.title}".\n\nШвидше заходь у додаток і відмічай її, щоб не втратити серію! 🔥`
                    );
                }
            }
        } catch (error) {
            console.error("❌ Помилка в Cron-задачі:", error);
        }
    });
};

module.exports = startCronJobs;