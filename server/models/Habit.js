const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },

    // Час та дата
    reminderTime: { type: String, default: "" },
    reminderDate: { type: String, default: "" },

    // Тип сповіщення
    reminderType: { 
        type: String, 
        enum: ['none', 'email', 'push', 'both'], 
        default: 'none' 
    },

    // Періодичність
    frequency: { 
        type: String, 
        enum: ['daily', 'weekly', 'monthly', 'specific_days', 'once'], // ДОДАНО 'once'
        default: 'daily' 
    },
    
    // Налаштування для одноразових
    specificDays: { 
        type: [Number], 
        default: [] 
    },

    // Налаштування для weekly та monthly
    weeklyDay: { type: String, default: "1" },
    monthlyDay: { type: String, default: "1" },
    monthlyMonth: { type: String, default: "0" },

    // Налаштування закріплення звички
    isPinned: { type: Boolean, default: false },

    completedDates: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Habit', HabitSchema);