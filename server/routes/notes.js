const router = require('express').Router();
const Note = require('../models/Note');
const verify = require('../middleware/verifyToken');

router.get('/', verify, async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user._id }).sort({ createdAt: -1 }); // Нові зверху
        res.json(notes);
    } catch (err) { res.status(500).json(err); }
});

router.post('/', verify, async (req, res) => {
    const newNote = new Note({ text: req.body.text, userId: req.user._id });
    try {
        const savedNote = await newNote.save();
        res.json(savedNote);
    } catch (err) { res.status(500).json(err); }
});

router.delete('/:id', verify, async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.json("Замітку видалено");
    } catch (err) { res.status(500).json(err); }
});

module.exports = router;