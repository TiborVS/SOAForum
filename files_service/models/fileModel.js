var mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: String,
    contentType: String,
    data: Buffer
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
