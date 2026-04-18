const router = require('express').Router();
const User = require('../models/User');
const verify = require('../middleware/verifyToken');

router.put('/update', verify, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: { username: req.body.username, email: req.body.email } },
            { new: true }
        );
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;