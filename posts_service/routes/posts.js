var express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Post = require('../models/postModel');

dotenv.config();

const userServiceLocation = process.env.USER_SERVICE_LOCATION;

const router = express.Router();

async function verifyToken(req, res, next) {
    if (!req.headers.authorization) return res.status(401).json({error: "You must be logged in to perform this action."});
    try {
        const response = await fetch(userServiceLocation + "/users/authenticate", {
            method: 'POST',
            headers: {
                "Authorization": req.headers.authorization
            }
        });
        const responseJson = await response.json();
        if (responseJson.error) return res.status(401).json({error: "Invalid authorization token."});
        req.user = responseJson;
        next();
    } catch (error) {
        return res.status(500).json({error: "Unknow error during authentication."});
    }
};

router.get('/', async function (req, res) {
    try {
        const posts = await Post.find({});
        res.json(posts);
    } catch (error) {
        res.status(500).json({error: "Unknown error getting posts."});
    }
});

router.get('/:id', async function (req, res) {
    try {
        const post = await Post.findById(req.params.id);
        if (post) res.json(post);
        else {
            res.status(404).json({error: "No post found with given id."});
        }
    } catch (error) {
        res.status(500).json({error: "Unknown error getting post."});
    }
});

router.post('/', verifyToken, async function (req, res) {
    // post post :)
});

router.put('/:id', verifyToken, async function (req, res) {
    // edit post
});

router.delete('/:id', verifyToken, async function (req, res) {
    // delete post
});

module.exports = router;
