const express = require('express');
const jwt = require('jsonwebtoken');
const File = require('../models/File');
const router = express.Router();

// ✅ Auth Middleware (sets req.userId)
function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id; // 👈 set userId
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

// ✅ Save a new file
router.post('/save', authMiddleware, async (req, res) => {
    const { name, html, css, js } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'File name is required' });
    }

    try {
        const existing = await File.findOne({ userId: req.userId, name });
        if (existing) {
            return res.status(400).json({ error: 'File name already exists' });
        }

        const file = await File.create({
            userId: req.userId,
            name,
            html,
            css,
            js
        });

        res.status(201).json(file);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ✅ Get all files of user
router.get('/myfiles', authMiddleware, async (req, res) => {
    try {
        const files = await File.find({ userId: req.userId });
        res.json(files);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// ✅ Get single file by ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const file = await File.findOne({ _id: req.params.id, userId: req.userId });
        if (!file) return res.status(404).json({ error: 'File not found' });
        res.json(file);
    } catch (err) {
        console.error('Error fetching file:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ✅ Delete file by ID
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const file = await File.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!file) {
            return res.status(404).json({ error: 'File not found or not authorized' });
        }
        res.json({ message: 'File deleted successfully' });
    } catch (err) {
        console.error('Error deleting file:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ✅ Check if file name already exists
router.post('/check-name', authMiddleware, async (req, res) => {
    const { name } = req.body;

    if (!name) return res.status(400).json({ error: 'Filename required' });

    try {
        const file = await File.findOne({ name, userId: req.userId }); // ✅ FIXED: use userId
        res.json({ exists: !!file });
    } catch (err) {
        console.error('Error checking file name:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
