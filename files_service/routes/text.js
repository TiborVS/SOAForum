var express = require('express');
const mongoose = require('mongoose');
var multer = require('multer');
var TextFile = require('../models/textFileModel');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

var ObjectId = mongoose.Types.ObjectId;

router.post('/', verifyToken, upload.single('file'), async (req, res) => {
    try {
        if (req.file.size > 16 * 1024 * 1024) {
            return res.status(400).json({ error: 'File size exceeds MongoDB limit (16MB).' });
        }
        const textFile = new TextFile({
            filename: req.file.originalname,
            contentType: req.file.mimetype,
            data: req.file.buffer.toString('utf-8'),
            postedBy: ObjectId.createFromHexString(req.user.userId)
        });
        await textFile.save();
        res.json({ fileId: textFile._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const textFile = await TextFile.findById(req.params.id);
        if (!textFile) return res.status(404).json({ error: 'File not found.' });
        res.contentType('text/plain');
        res.send(textFile.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', verifyToken, upload.single('file'), async (req, res) => {
    try {
        const file = await TextFile.findById(req.params.id);
        if (!file) {
            return res.status(404).json({error: "No file found with given id."});
        }
        if (req.user.userId != file.postedBy.toString()) {
            return res.status(403).json({error: "Not authorized to edit this file."});
        }
        
        if (req.file.size > 16 * 1024 * 1024) {
            return res.status(400).json({ error: 'File size exceeds MongoDB limit (16MB).' });
        }

        file.filename = req.file.originalname;
        file.contentType = req.file.mimetype;
        file.data = req.file.buffer.toString('utf-8');
        await file.save();
        res.json({ message: "Successfully updated file." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const file = await TextFile.findById(req.params.id);
        if (!file) {
            return res.status(404).json({error: "No file found with given id."});
        }
        if (req.user.userId != file.postedBy.toString()) {
            return res.status(403).json({error: "Not authorized to delete this file."});
        }

        await file.deleteOne();
        res.json({ message: "Successfully deleted file." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
