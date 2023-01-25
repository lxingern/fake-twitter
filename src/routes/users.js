const express = require('express')
const router = express.Router()
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')
const { checkReturnTo } = require('../middleware')
const User = require('../models/user')

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', catchAsync(async (req, res, next) => {
    const { email, username, password } = req.body
    const user = new User({ email, username })
    const registeredUser = await User.register(user, password)
    req.login(registeredUser, err => {
        if (err) return next(err)
        res.redirect('/tweets')
    })
}))

router.get('/login', (req, res) => {
    if (req.query.returnTo) {
        req.session.returnTo = req.query.returnTo
    }
    res.render('users/login')
})

router.post('/login', checkReturnTo, passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
    // failureFlash: true
    const redirectUrl = res.locals.returnTo || '/tweets'
    res.redirect(redirectUrl)
})

router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) return next(err)
        res.redirect('/login');
    })
})

module.exports = router