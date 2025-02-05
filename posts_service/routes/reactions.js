var express = require('express');
var mongoose = require('mongoose');
const getPostById = require("../middleware/getPostById");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router({mergeParams: true});

router.get('/', getPostById, async function (req, res) {
    return res.status(200).json(req.post.reactions);
});

router.get('/:reactionId', getPostById, async function (req, res) {
    var found = false;
    req.post.reactions.forEach(reaction => {
        if (reaction._id.toString() == req.params.reactionId) {
            found = true;
            return res.status(200).json(reaction);
        }
    });
    if (!found) return res.status(404).json({error: "No reaction found with given id."});
    else return;
});

router.post('/', verifyToken, getPostById, async function (req, res) {
    const type = req.body.type;
    const post = req.post;
    if (type != "like" && type != "dislike") {
        return res.status(400).json({error: "Reaction can only have type 'like' or 'dislike'."});
    }
    if (req.post.postedBy.toString() == req.user.userId) {
        return res.status(401).json({error: "You cannot react to your own post."});
    }

    try {
        post.reactions.push({type: type, reactedBy: mongoose.Types.ObjectId.createFromHexString(req.user.userId)});
        await post.save();
        return res.status(201).json({message: "Successfully added reaction.", reaction: post.reactions.at(-1)})
    } catch (error) {
        return res.status(500).json({error: "Unknown error adding reaction.", detail: error.message});
    }
});

router.put('/:reactionId', verifyToken, getPostById, async function (req, res) {
    const type = req.body.type;
    if (type != "like" && type != "dislike") {
        return res.status(400).json({error: "Reaction can only have type 'like' or 'dislike'."});
    }
    var reaction = null;
    var found = false;
    req.post.reactions.forEach( r => {
        if (found) return;
        if (r._id.toString() == req.params.reactionId) {
            reaction = r;
            found = true;
        }
    });
    if (!found) return res.status(404).json({error: "No reaction found with given id."});
    if (req.user.userId != reaction.reactedBy.toString()) return res.status(401).json({error: "Not authorized to edit this reaction."});
    try {
        reaction.type = type;
        await req.post.save();
        return res.status(200).json({message: "Successfully edited reaction.", reaction: reaction});
    } catch (error) {
        return res.status(500).json({error: "Unknown error editing reaction."});
    }
});

router.delete('/:reactionId', verifyToken, getPostById, async function (req, res) {
    var reaction = null;
    var found = false;
    req.post.reactions.forEach( r => {
        if (found) return;
        if (r._id.toString() == req.params.reactionId) {
            reaction = r;
            found = true;
        }
    });
    if (!found) return res.status(404).json({error: "No reaction found with given id."});
    if (req.user.userId != reaction.reactedBy.toString() && !req.user.isAdmin) return res.status(401).json({error: "Not authorized to delete this reaction."});
    req.post.reactions.pull(req.params.reactionId);
    try {
        await req.post.save();
        return res.status(200).json({message: "Successfully deleted reaction.", reaction: reaction});
    } catch (error) {
        return res.status(500).json({error: "Unknown error deleting reaction."});
    }
});

module.exports = router;
