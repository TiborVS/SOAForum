const mongoose = require('mongoose');
const reactionSchema = require('./reactionModel');

const postSchema = new mongoose.Schema({
    text: { type: String, required: true },
    thread: { type: mongoose.Schema.Types.ObjectId, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, required: true },
    postedOn: { type: Date, default: Date.now },
    lastModified: { type: Date, default: Date.now },
    reactions: [reactionSchema]
}, {collection: "posts" });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
