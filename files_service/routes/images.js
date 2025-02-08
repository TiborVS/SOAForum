var express = require('express');
const mongoose = require('mongoose');
var multer = require('multer');
var ImageFile = require('../models/imageFileModel');
const verifyToken = require('../middleware/verifyToken');


const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

var ObjectId = mongoose.Types.ObjectId;

router.post('/', verifyToken, upload.single('file'), async (req, res) => {
    try {
        if (req.file.size > 16 * 1024 * 1024) {
            return res.status(400).json({ error: 'File size exceeds MongoDB limit (16MB).' });
        }
        const file = new ImageFile({
            filename: req.file.originalname,
            contentType: req.file.mimetype,
            data: req.file.buffer,
            postedBy: ObjectId.createFromHexString(req.user.userId)
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
        if (!file) return res.status(404).json({ error: 'File not found.' });
        res.contentType(file.contentType);
        res.send(file.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', verifyToken, upload.single('file'), async (req, res) => {
    try {
        const image = await ImageFile.findById(req.params.id);
        if (!image) {
            return res.status(404).json({error: "No image found with given id."});
        }
        if (req.user.userId != image.postedBy.toString()) {
            return res.status(403).json({error: "Not authorized to edit this image."});
        }

        if (req.file.size > 16 * 1024 * 1024) {
            return res.status(400).json({ error: 'File size exceeds MongoDB limit (16MB).' });
        }
        image.filename = req.file.originalname;
        image.contentType = req.file.mimetype;
        image.data = req.file.buffer;
        await image.save();
        res.json({ message: "Successfully updated image." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const image = await ImageFile.findById(req.params.id);
        if (!image) {
            return res.status(404).json({error: "No image found with given id."});
        }
        if (req.user.userId != image.postedBy.toString()) {
            return res.status(403).json({error: "Not authorized to delete this image."});
        }
        await image.deleteOne();
        res.json({ message: "Successfully deleted image." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
