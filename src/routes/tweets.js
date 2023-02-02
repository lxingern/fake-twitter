const express = require('express')
const router = express.Router()
const dayjs = require('dayjs')
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, isAuthor } = require('../middleware')
const Tweet = require('../models/tweet')
const ExpressError = require('../utils/ExpressError')

router.get('/', isLoggedIn, catchAsync(async (req, res) => {
    const tweets = await Tweet.find({}).populate('author').sort({ createdAt: -1 }).lean()
    tweets.forEach((tweet) => {
        const sinceCreated = Date.now() - tweet.createdAt
        if (sinceCreated < 1000 * 60 * 60) {
            tweet.timestamp = `${Math.floor(sinceCreated / (1000 * 60))}m`
        } else if (sinceCreated < 1000 * 60 * 60 * 24) {
            tweet.timestamp = `${Math.floor(sinceCreated / (1000 * 60 * 60))}h`
        } else {
            tweet.timestamp = dayjs(tweet.createdAt).format('D MMM')
        }
    })
    res.render('tweets/index', { tweets, title: 'Simple Twitter' })
}))

router.get('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const tweet = await Tweet.findById(req.params.id).populate('author')
    if (!tweet) {
        res.send('That tweet does not exist!')
    }
    const createdAt = dayjs(tweet.createdAt).format('h:mm A · MMM D, YYYY')
    res.render('tweets/show', { tweet, createdAt, title: 'Simple Twitter' })
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const tweet = await Tweet.findById(req.params.id)
    if (!tweet) {
        res.send('That tweet does not exist!')
    }
    res.render('tweets/edit', { tweet })
}))

router.post('/', isLoggedIn, catchAsync(async (req, res) => {
    // if (!req.body) throw new ExpressError('Invalid tweet!', 400)
    const tweet = new Tweet(req.body)
    tweet.author = req.user._id
    await tweet.save()
    res.redirect('/tweets')
}))

router.patch('/:id/likes', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params
    const tweet = await Tweet.findById(id)
    const user = req.user
    if (tweet.author.equals(req.user._id)) {
        throw new ExpressError("Unable to like your own tweet.", 400)
    }
    const likedTweet = tweet.likedByCurrentUser(user)
    if (likedTweet) {
        throw new ExpressError("Unable to like a tweet you have already liked.", 400)
    }
    user.likedTweets.push(tweet)
    tweet.likes++
    // await Tweet.findByIdAndUpdate(id, { $inc: { likes: 1 } })
    await user.save()
    console.log(user)
    await tweet.save()
    res.redirect(`/tweets`)
}))

router.patch('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params
    const tweet = await Tweet.findById(id)
    if (!tweet.author.equals(req.user._id)) {
        throw new ExpressError("Unable to edit another user's tweet.", 400)
    }
    const updatedTweet = await Tweet.findByIdAndUpdate(id, { text: req.body.text })
    await updatedTweet.save()
    res.redirect('/tweets')
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    await Tweet.findByIdAndRemove(req.params.id)
    res.redirect('/tweets')
}))

module.exports = router