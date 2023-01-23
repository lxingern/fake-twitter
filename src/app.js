const path = require('path')
const express = require('express')
require('./db/mongoose')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const dayjs = require('dayjs')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const Tweet = require('./models/tweet')
const User = require('./models/user')
const { isLoggedIn } = require('./middleware')
const { Router } = require('express')

const app = express()

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs')
app.set('views', viewsPath)

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.static(publicDirectoryPath))

const sessionConfig = {
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.get('/register', (req, res) => {
    res.render('users/register')
})

app.post('/register', async (req, res) => {
    const { email, username, password } = req.body
    const user = new User({ email, username })
    const registeredUser = await User.register(user, password)
    console.log(registeredUser)
    res.redirect('/tweets')
})

app.get('/login', (req, res) => {
    res.render('users/login')
})

app.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    res.redirect('/tweets')
})

app.get('/logout', (req, res) => {
    req.logout(function(err) {
        return res.redirect('/login');
    })
})

app.get('/tweets', isLoggedIn, async (req, res) => {
    const tweets = await Tweet.find({})
    res.render('index', { tweets })
})

app.get('/tweets/:id', isLoggedIn, async (req, res) => {
    const tweet = await Tweet.findById(req.params.id)
    if (!tweet) {
        res.send('That tweet does not exist!')
    }
    const createdAt = dayjs(tweet.createdAt).format('h:mm A · MMM D, YYYY')
    res.render('show', { tweet, createdAt })
})

app.get('/tweets/:id/edit', isLoggedIn, async (req, res) => {
    const tweet = await Tweet.findById(req.params.id)
    res.render('edit', { tweet })
})

app.post('/tweets', isLoggedIn, async (req, res) => {
    const tweet = new Tweet(req.body)
    await tweet.save()
    res.redirect('/tweets')
})

app.patch('/tweets/:id', isLoggedIn, async (req, res) => {
    if (req.body.text) {
        const tweet = await Tweet.findByIdAndUpdate(req.params.id, { text: req.body.text })
        await tweet.save()
    } else {
        const tweet = await Tweet.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } })
        await tweet.save()
    }
    res.redirect('/tweets')
})

app.delete('/tweets/:id', isLoggedIn, async (req, res) => {
    await Tweet.findByIdAndRemove(req.params.id)
    res.redirect('/tweets')
})

app.listen(3000, () => {
    console.log('Server is up on port 3000!')
})