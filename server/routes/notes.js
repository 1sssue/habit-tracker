const router = require('express').Router();
const Note = require('../models/Note');
const verify = require('../middleware/verifyToken'); // Переконайся, що шлях до middleware правильний

router.get('/', verify, async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user._id }).sort({ createdAt: -1 }); // Нові зверху
        res.json(notes);
    } catch (err) { 
        res.status(500).json(err); 
    }
});

router.post('/', verify, async (req, res) => {
    const newNote = new Note({ 
        title: req.body.title, 
        content: req.body.content,
        userId: req.user._id 
    });
    
    try {
        const savedNote = await newNote.save();
        res.json(savedNote);
    } catch (err) { 
        res.status(500).json(err); 
    }
});

router.delete('/:id', verify, async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.json("Нотатку видалено");
    } catch (err) { 
        res.status(500).json(err); 
    }
});

module.exports = router;