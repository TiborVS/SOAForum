var mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    filename: String,
    contentType: String,
    data: Buffer,
    postedBy: mongoose.Types.ObjectId
}, { collection: "images" });

const ImageFile = mongoose.model('ImageFile', imageSchema);

module.exports = ImageFile;
