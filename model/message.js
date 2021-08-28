const mongoose = require('mongoose');

const message = new mongoose.Schema(
    {
        users: [{ type: String }],
        sender: String,
        msg: String,
        convoName: String,
        roomID: Number
    }
)

const messages = mongoose.model('messages',message);

module.exports = messages;