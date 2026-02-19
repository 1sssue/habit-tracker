const router = require('express').Router();
const Habit = require('../models/Habit');
const verify = require('../middleware/verifyToken');

router.get('/', verify, async (req, res) => {
    try {
        const habits = await Habit.find({ userId: req.user._id });
        res.json(habits);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

router.post('/', verify, async (req, res) => {
    const newHabit = new Habit({
        title: req.body.title,
        description: req.body.description,
        userId: req.user._id
    });

    try {
        const savedHabit = await newHabit.save();
        res.json(savedHabit);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

router.put('/:id/toggle', verify, async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);
        const today = new Date().toISOString().split('T')[0];

        if (habit.completedDates.includes(today)) {
            await habit.updateOne({ $pull: { completedDates: today } });
            res.json("Виконання скасовано");
        } else {
            await habit.updateOne({ $push: { completedDates: today } });
            res.json("Звичку виконано!");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/:id', verify, async (req, res) => {
    try {
        await Habit.findByIdAndDelete(req.params.id);
        res.json("Звичку видалено!");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;