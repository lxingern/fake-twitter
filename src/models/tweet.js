const mongoose = require('mongoose')

const tweetSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 280
    }, 
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    likes: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

tweetSchema.methods.likedByCurrentUser = function (user) {
    const tweet = this
    const likedTweet = user.likedTweets.find(likedTweet => {
        return likedTweet.equals(tweet)
    })
    return !!likedTweet
}

const Tweet = mongoose.model('Tweet', tweetSchema)

module.exports = Tweet