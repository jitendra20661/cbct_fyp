const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {type: String},
    email: {type: String},
    password: {type: String},
    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('User', userSchema, 'user_collection')