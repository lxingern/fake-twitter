const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    likedTweets: [{
        likedTweet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tweet'
        }
    }],
    image: {
        url: String,
        filename: String
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema)