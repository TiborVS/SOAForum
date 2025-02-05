const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
    type: { type: String, required: true, default: "like" },
    reactedBy: { type: mongoose.Schema.Types.ObjectId, required: true }
});

module.exports = reactionSchema;
