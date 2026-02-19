const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');
const habitRoute = require('./routes/habits');
const aiRoute = require('./routes/ai');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/habits', habitRoute);
app.use('/api/ai', aiRoute);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ База даних MongoDB підключена!'))
    .catch((err) => console.log('❌ Помилка підключення до БД:', err));

app.get('/', (req, res) => {
    res.send('Сервер працює і підключений до БД!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Сервер запущено на порту: ${PORT}`);
});