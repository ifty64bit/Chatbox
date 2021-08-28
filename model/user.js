const mongoose = require('mongoose');
const { Schema } = mongoose;

const users = new Schema({
    username: String,
    password: String,
    },
    {
        timestamps: true,
    })

const user = mongoose.model('users', users);

module.exports = user;