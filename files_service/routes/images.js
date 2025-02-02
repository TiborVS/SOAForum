var express = require('express');
var multer = require('multer');
var ImageFile = require('../models/imageFileModel');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), async (req, res) => {
    try {
        if (req.file.size > 16 * 1024 * 1024) {
            return res.status(400).json({ error: 'File size exceeds MongoDB limit (16MB)' });
        }
        const file = new ImageFile({
            filename: req.file.originalname,
            contentType: req.file.mimetype,
            data: req.file.buffer
        });
        await file.save();
        res.json({ fileId: file._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const file = await ImageFile.findById(req.params.id);
        if (!file) return res.status(404).json({ error: 'File not found' });
        res.contentType(file.contentType);
        res.send(file.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await ImageFile.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
