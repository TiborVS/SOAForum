const Post = require("../models/postModel");

async function getPostById(req, res, next) {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) res.status(404).json({error: "No post found with given id."});
        req.post = post;
        next();
    } catch (error) {
        return res.status(500).json({error: "Unknown error getting post."});
    }
}

module.exports = getPostById;
