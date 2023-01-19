const path = require('path')
const express = require('express')
require('./db/mongoose')
const ejsMate = require('ejs-mate')
const Tweet = require('./models/tweet')

const app = express()

const viewsPath = path.join(__dirname, '../templates/views')

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs')
app.set('views', viewsPath)

app.use(express.urlencoded({ extended: true }));

app.get('/tweets', async (req, res) => {
    const tweets = await Tweet.find({})
    // res.status(200).send(tweets)
    res.render('index', { tweets })
})

app.get('/tweets/:id', async (req, res) => {
    const tweet = await Tweet.findById(req.params.id)
    if (!tweet) {
        res.send('That tweet does not exist!')
    }
    res.render('show', { tweet })
})

app.post('/tweets', async (req, res) => {
    const tweet = new Tweet(req.body)
    await tweet.save()
    res.redirect('/tweets')
})

app.listen(3000, () => {
    console.log('Server is up on port 3000!')
})