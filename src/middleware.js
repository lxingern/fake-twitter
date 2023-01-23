const Tweet = require('./models/tweet')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect(`/login?returnTo=${req.originalUrl}`)
    }
    next()
}

module.exports.checkReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo
    }
    next()
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params
    const tweet = await Tweet.findById(id)
    if (!tweet.author.equals(req.user._id)) {
        return res.redirect(`/tweets/${id}`)
    }
    next()
}