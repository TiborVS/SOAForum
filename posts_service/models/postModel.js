const mongoose = require('mongoose');
const reactionSchema = require('./reactionModel');

const attachmentSchema = new mongoose.Schema({
    name: { type: String, required: true},
    id: { type: mongoose.Schema.Types.ObjectId, required: true},
    fileType: { type: String, required: true}
}, { _id: false });

const postSchema = new mongoose.Schema({
    text: { type: String, required: true },
    thread: { type: mongoose.Schema.Types.ObjectId, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, required: true },
    postedOn: { type: Date, default: Date.now },
    lastModified: { type: Date, default: Date.now },
    reactions: [reactionSchema],
    attachment: { type: attachmentSchema, required: false }
}, {collection: "posts" });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
