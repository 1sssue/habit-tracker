const cron = require('node-cron');
const webpush = require('web-push');
const Habit = require('./models/Habit');
const User = require('./models/User');
const sendEmail = require('./utils/sendEmail');

const startCronJobs = () => {
    console.log("⏳ Планувальник нагадувань (Cron) запущено...");

    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date();
            
            const timeFormatter = new Intl.DateTimeFormat('uk-UA', {
                timeZone: 'Europe/Kyiv', hour: '2-digit', minute: '2-digit', hour12: false
            });
            const currentTime = timeFormatter.format(now);

            const kyivDateString = now.toLocaleString("en-US", { timeZone: "Europe/Kyiv" });
            const kyivDate = new Date(kyivDateString);
            const today = kyivDate.toISOString().split('T')[0]; 
            
            const currentDayOfWeek = kyivDate.getDay(); 
            const currentDayOfMonth = kyivDate.getDate();

            const habits = await Habit.find({
                reminderTime: currentTime,
                completedDates: { $ne: today }
            });

            if (habits.length === 0) return;

            const notificationPromises = [];

            for (let habit of habits) {
                let shouldRemind = false;

                if (habit.frequency === 'daily') {
                    shouldRemind = true;
                } else if (habit.frequency === 'weekly' && currentDayOfWeek === 1) { 
                    shouldRemind = true;
                } else if (habit.frequency === 'monthly' && currentDayOfMonth === 1) { 
                    shouldRemind = true;
                } else if (habit.frequency === 'specific_days' && habit.specificDays.includes(currentDayOfWeek)) {
                    shouldRemind = true; 
                }

                if (!shouldRemind || habit.reminderType === 'none') continue;

                const user = await User.findById(habit.userId);
                if (!user) continue;

                const emailTitle = "⏰ Час для твоєї звички!";
                const emailMessage = `Привіт, ${user.username}!\n\nНагадуємо, що зараз час виконати твою звичку: "${habit.title}".\n\nШвидше заходь у додаток і відмічай її, щоб не втратити серію! 🔥`;

                if ((habit.reminderType === 'email' || habit.reminderType === 'both') && user.email) {
                    notificationPromises.push(
                        sendEmail(user.email, emailTitle, emailMessage)
                            .catch(err => console.error(`❌ Помилка Email для ${user.email}:`, err))
                    );
                }

                if ((habit.reminderType === 'push' || habit.reminderType === 'both') && user.pushSubscription) {
                    const payload = JSON.stringify({
                        title: "Habit Tracker 🔥",
                        body: `Час для звички: "${habit.title}". Не розривай серію!`,
                        icon: '/icon-192x192.png',
                        url: '/'
                    });

                    notificationPromises.push(
                        webpush.sendNotification(user.pushSubscription, payload)
                            .catch(async (err) => {
                                console.error(`❌ Помилка Push для ${user.username}:`, err.statusCode || err);
                                if (err.statusCode === 410 || err.statusCode === 404) {
                                    await User.findByIdAndUpdate(user._id, { pushSubscription: null });
                                    console.log(`🗑 Мертву підписку для ${user.username} видалено.`);
                                }
                            })
                    );
                }
            }

            if (notificationPromises.length > 0) {
                await Promise.allSettled(notificationPromises);
            }

        } catch (error) {
            console.error("❌ Помилка в Cron-задачі:", error);
        }
    });
};

module.exports = startCronJobs;