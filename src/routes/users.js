const express = require('express')
const router = express.Router()
const passport = require('passport')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, checkReturnTo } = require('../middleware')
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
    res.render('users/login', { loginErrors: req.session.messages || [] })
    req.session.messages = []
})

router.post('/login', checkReturnTo, passport.authenticate('local', { failureRedirect: '/login', failureMessage: 'Invalid username or password.' }), (req, res) => {
    const redirectUrl = res.locals.returnTo || '/tweets'
    res.redirect(redirectUrl)
})

router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) return next(err)
        res.redirect('/login');
    })
})

router.get('/myavatar', isLoggedIn, (req, res) => {
    res.render('users/uploadavatar')
})

router.patch('/myavatar', isLoggedIn, upload.single('avatar'), catchAsync(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.user._id, { 
        image: {
            url: req.file.path,
            filename: req.file.filename
        } 
    })
    await user.save()
    res.redirect('/tweets')
}))

module.exports = router