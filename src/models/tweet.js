const mongoose = require('mongoose')

const tweetSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 280
    }, 
    likes: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

const Tweet = mongoose.model('Tweet', tweetSchema)

module.exports = Tweet