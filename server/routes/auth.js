const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
        });

        const user = await newUser.save();

        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json("Користувача не знайдено!");

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).json("Невірний пароль!");

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, token });

    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;