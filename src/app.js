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

app.use(express.json())

app.get('', (req, res) => {
    res.render('index')
})

app.post('/tweets', async (req, res) => {
    const tweet = new Tweet(req.body)
    try {
        await tweet.save()
        res.status(201).send(tweet)
    } catch (e) {
        res.status(500).send(e)
    }
})

app.listen(3000, () => {
    console.log('Server is up on port 3000!')
})