const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },

    reminderTime: { type: String, default: "" }, 
    reminderType: { 
        type: String, 
        enum: ['none', 'email', 'push', 'both'], 
        default: 'none' 
    },
    
    frequency: { 
        type: String, 
        enum: ['daily', 'weekly', 'monthly', 'specific_days'], 
        default: 'daily' 
    },
    specificDays: { 
        type: [Number], 
        default: [] 
    },

    completedDates: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Habit', HabitSchema);