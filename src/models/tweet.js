const mongoose = require('mongoose')
const dayjs = require('dayjs')

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

tweetSchema.virtual('sinceCreated').get(function() {
    const sinceCreated = Date.now() - this.createdAt
    if (sinceCreated < 1000 * 60 * 60) {
        return `${Math.floor(sinceCreated / (1000 * 60))}m`
    } else if (sinceCreated < 1000 * 60 * 60 * 24) {
        return `${Math.floor(sinceCreated / (1000 * 60 * 60))}h`
    } else {
        return dayjs(this.createdAt).format('D MMM')
    }
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