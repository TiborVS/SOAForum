var express = require('express');
const mongoose = require('mongoose');
const Post = require('../models/postModel');
const reactionsRouter = require('./reactions');
const verifyToken = require('../middleware/verifyToken');

const threadServiceLocation = process.env.THREAD_SERVICE_LOCATION;

var ObjectId = mongoose.Types.ObjectId

const router = express.Router();

router.use('/:postId/reactions', reactionsRouter);

router.get('/', async function (req, res) {
    try {
        const posts = await Post.find({});
        res.json(posts);
    } catch (error) {
        res.status(500).json({error: "Unknown error getting posts."});
    }
});

router.get('/thread/:threadId', async function (req, res) {
    try {
        const posts = await Post.find({thread: ObjectId.createFromHexString(req.params.threadId)});
        return res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({error: "Unknown error getting posts by thread."});
    }
});

router.get('/user/:userId', async function (req, res) {
    try {
        const posts = await Post.find({postedBy: ObjectId.createFromHexString(req.params.userId)});
        return res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({error: "Unknown error getting posts by user."});
    }
});

router.get('/:postId', async function (req, res) {
    try {
        const post = await Post.findById(req.params.postId);
        if (post) res.json(post);
        else {
            res.status(404).json({error: "No post found with given id."});
        }
    } catch (error) {
        res.status(500).json({error: "Unknown error getting post."});
    }
});

router.post('/', verifyToken, async function (req, res) {
    const text = req.body.text;
    const thread = req.body.thread;
    if (!text) {
        return res.status(400).json({error: "Post must contain text."});
    }
    if (!thread) {
        return res.status(400).json({error: "Post must be part of a thread."});
    }
    try {
        const response = await fetch(threadServiceLocation + "/threads/" + thread);
        if (response.status == 404) return res.status(404).json({error: "Thread doesn't exist."});
        else if (!response.ok) return res.status(500).json({error: "Unknown error getting thread info, threads service returned status " + response.status});
        const post = new Post({ text, thread, postedBy: ObjectId.createFromHexString(req.user.userId)});
        await post.save();
        return res.status(201).json({message: "Successfully created post.", post: post});
    } catch (error) {
        return res.status(500).json({error: "Unknown error creating post.", detail: error.message});
    }
});

router.put('/:postId', verifyToken, async function (req, res) {
    const text = req.body.text;
    if (!text) {
        return res.status(400).json({error: "Edit request must contain text."});
    }
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({error: "No post found with given id."});
        }
        if (req.user.userId != post.postedBy.toString()) {
            return res.status(401).json({error: "Not authorized to edit this post."});
        }
        post.text = text;
        post.lastModified = Date.now();
        await post.save();
        return res.status(200).json({message: "Successfully edited post.", post: post});
    } catch (error) {
        return res.status(500).json({error: "Unknown error editing post."});
    }
});

router.delete('/:postId', verifyToken, async function (req, res) {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({error: "No post found with given id."});
        }
        if (req.user.userId != post.postedBy.toString() && !req.user.isAdmin) {
            return res.status(401).json({error: "Not authorized to delete this post."});
        }
        await post.deleteOne();
        return res.status(200).json({message: "Successfully deleted post."});
    } catch (error) {
        return res.status(500).json({error: "Unknown error deleting post."});
    }
});

module.exports = router;
