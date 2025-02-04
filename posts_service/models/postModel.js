const mongoose = require('mongoose');
const Reaction = require('./reactionModel');

const postSchema = new mongoose.Schema({
    text: { type: String, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId },
    postedOn: { type: Date, default: Date.now },
    lastModified: { type: Date, default: Date.now },
    reactions: [Reaction]
}, {collection: "posts" });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
