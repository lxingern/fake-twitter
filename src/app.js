const path = require('path')
const express = require('express')
const ejsMate = require('ejs-mate')

const app = express()

const viewsPath = path.join(__dirname, '../templates/views')

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs')
app.set('views', viewsPath)

app.get('', (req, res) => {
    res.render('index')
})

app.listen(3000, () => {
    console.log('Server is up on port 3000!')
})