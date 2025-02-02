var mongoose = require('mongoose');

const textSchema = new mongoose.Schema({
    filename: String,
    contentType: String,
    data: Buffer
}, { collection: "text" });

const TextFile = mongoose.model('TextFile', textSchema);

module.exports = TextFile;
