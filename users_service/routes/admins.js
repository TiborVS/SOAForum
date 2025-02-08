const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Admin = require('../models/adminModel');

dotenv.config();
const router = express.Router();

const verifyTokenAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.isAdmin) return res.status(401).json({error: 'Access denied' });
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

router.get('/', verifyTokenAdmin, async (req, res) => {
    try {
        const admins = await Admin.find({}, {password: 0});
        res.json(admins);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', verifyTokenAdmin, async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id, {password: 0});
        if (!admin) return res.status(404).json({ error: 'Admin not found.' });
        res.json(admin);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

router.post('/', verifyTokenAdmin, async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ username, email, password: hashedPassword });
        await newAdmin.save();

        const token = jwt.sign(
            {
            userId: newAdmin._id,
            username: newAdmin.username,
            isAdmin: true
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({ token: token,  user: {
            username: newAdmin.username,
            _id: newAdmin._id,
            email: newAdmin.email,
            profilePictureId: newAdmin.profilePictureId,
            signature: newAdmin.signature,
            joined: newAdmin.joined
        }});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', verifyTokenAdmin, async (req, res) => {
    if (req.user.userId !== req.params.id) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    try {
        await Admin.findByIdAndUpdate(req.params.id, req.body);
        res.json({ message: 'Admin updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', verifyTokenAdmin, async (req, res) => {
    if (req.user.userId !== req.params.id) {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    
    try {
        await Admin.findByIdAndDelete(req.params.id);
        res.json({ message: 'Admin deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email: email });
        if (!admin) return res.status(404).json({ error: 'Admin not found' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign(
            {
                userId: admin._id,
                username: admin.username,
                isAdmin: true
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token: token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  });

module.exports = router;
