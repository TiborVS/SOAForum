const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/userModel');

dotenv.config();
const router = express.Router();

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'You must be logged in to perform this action.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid authentication token.' });
    }
};

router.get('/', verifyToken, async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ error: 'Not authorized to perform this action.' });
    }

    try {
        const users = await User.find({}, '-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id/username', async (req, res) => {
    try {
        const user = await User.findById(req.params.id, 'username');
        if (!user) return res.status(404).json({ error: 'User not found.' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        if (req.user.userId !== req.params.id && !req.user.isAdmin) {
            var user = await User.findById(req.params.id, { password: 0, email: 0});
        }
        else {
            user = await User.findById(req.params.id, {password: 0});
        }
        if (!user) return res.status(404).json({ error: 'User not found.' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    

    
});

router.post('/', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign(
            {
            userId: newUser._id,
            username: newUser.username,
            isAdmin: false
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({ token: token, user: {
            username: newUser.username,
            _id: newUser._id,
            email: newUser.email,
            profilePictureId: newUser.profilePictureId,
            signature: newUser.signature,
            joined: newUser.joined
        } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    if (req.user.userId !== req.params.id && !req.user.isAdmin) {
        return res.status(403).json({ error: 'Unauthorized.' });
    }

    try {
        await User.findByIdAndUpdate(req.params.id, req.body);
        res.json({ message: 'User successfully updated.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    if (req.user.userId !== req.params.id && !req.user.isAdmin) {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User successfully deleted.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/authenticate', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ token: decoded });
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign(
        {
            userId: user._id,
            username: user.username,
            isAdmin: false
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
        );

        res.json({ token: token, user: {
            username: user.username,
            _id: user._id,
            email: user.email,
            profilePictureId: user.profilePictureId,
            signature: user.signature,
            joined: user.joined
        } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  });

module.exports = router;
