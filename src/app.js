const path = require('path')
const express = require('express')
require('./db/mongoose')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const Tweet = require('./models/tweet')

const app = express()

const viewsPath = path.join(__dirname, '../templates/views')

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs')
app.set('views', viewsPath)

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

app.get('/tweets', async (req, res) => {
    const tweets = await Tweet.find({})
    res.render('index', { tweets })
})

app.get('/tweets/:id', async (req, res) => {
    const tweet = await Tweet.findById(req.params.id)
    if (!tweet) {
        res.send('That tweet does not exist!')
    }
    res.render('show', { tweet })
})

app.get('/tweets/:id/edit', async (req, res) => {
    const tweet = await Tweet.findById(req.params.id)
    res.render('edit', { tweet })
})

app.post('/tweets', async (req, res) => {
    const tweet = new Tweet(req.body)
    await tweet.save()
    res.redirect('/tweets')
})

app.patch('/tweets/:id', async (req, res) => {
    if (req.body.text) {
        const tweet = await Tweet.findByIdAndUpdate(req.params.id, { text: req.body.text })
        await tweet.save()
    } else {
        const tweet = await Tweet.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } })
        await tweet.save()
    }
    res.redirect('/tweets')
})

app.listen(3000, () => {
    console.log('Server is up on port 3000!')
})