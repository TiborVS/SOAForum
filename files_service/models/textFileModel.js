var mongoose = require('mongoose');

const textSchema = new mongoose.Schema({
    filename: String,
    contentType: String,
    data: Buffer,
    postedBy: mongoose.Types.ObjectId
}, { collection: "text" });

const TextFile = mongoose.model('TextFile', textSchema);

module.exports = TextFile;
