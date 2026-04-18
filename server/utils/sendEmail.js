const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Habit Tracker AI" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: subject,
            text: text,
        });

        console.log("✅ Лист успішно відправлено на:", email);
    } catch (error) {
        console.log("❌ Помилка відправки листа!");
        console.error(error);
    }
};

module.exports = sendEmail;