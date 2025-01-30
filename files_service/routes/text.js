var express = require('express');
var multer = require('multer');
var File = require('../models/fileModel');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), async (req, res) => {
    try {
        if (req.file.size > 16 * 1024 * 1024) {
            return res.status(400).json({ error: 'File size exceeds MongoDB limit (16MB)' });
        }
        const textFile = new File({
            filename: req.file.originalname,
            contentType: req.file.mimetype,
            data: req.file.buffer.toString('utf-8')
        });
        await textFile.save();
        res.json({ fileId: textFile._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const textFile = await File.findById(req.params.id);
        if (!textFile) return res.status(404).json({ error: 'File not found' });
        res.contentType('text/plain');
        res.send(textFile.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', upload.single('file'), async (req, res) => {
    try {
        if (req.file.size > 16 * 1024 * 1024) {
            return res.status(400).json({ error: 'File size exceeds MongoDB limit (16MB)' });
        }
        await File.findByIdAndUpdate(req.params.id, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
            data: req.file.buffer.toString('utf-8')
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await File.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
