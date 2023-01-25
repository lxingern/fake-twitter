const express = require('express')
const router = express.Router()
const dayjs = require('dayjs')
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, isAuthor } = require('../middleware')
const Tweet = require('../models/tweet')

router.get('/', isLoggedIn, catchAsync(async (req, res) => {
    const tweets = await Tweet.find({}).populate('author')
    res.render('index', { tweets })
}))

router.get('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const tweet = await Tweet.findById(req.params.id).populate('author')
    if (!tweet) {
        res.send('That tweet does not exist!')
    }
    const createdAt = dayjs(tweet.createdAt).format('h:mm A · MMM D, YYYY')
    res.render('show', { tweet, createdAt })
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const tweet = await Tweet.findById(req.params.id)
    if (!tweet) {
        res.send('That tweet does not exist!')
    }
    res.render('edit', { tweet })
}))

router.post('/', isLoggedIn, catchAsync(async (req, res) => {
    // if (!req.body) throw new ExpressError('Invalid tweet!', 400)
    const tweet = new Tweet(req.body)
    tweet.author = req.user._id
    await tweet.save()
    res.redirect('/tweets')
}))

router.patch('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params
    if (req.body.text) {
        const tweet = await Tweet.findById(id)
        if (!tweet.author.equals(req.user._id)) {
            return res.redirect(`/tweets/${id}`)
        }
        const updatedTweet = await Tweet.findByIdAndUpdate(id, { text: req.body.text })
        await updatedTweet.save()
    } else {
        const tweet = await Tweet.findByIdAndUpdate(id, { $inc: { likes: 1 } })
        await tweet.save()
    }
    res.redirect('/tweets')
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    await Tweet.findByIdAndRemove(req.params.id)
    res.redirect('/tweets')
}))

module.exports = router