const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    reminderTime: { type: String, default: "" }, // НОВЕ ПОЛЕ (формат "HH:mm")
    completedDates: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Habit', HabitSchema);