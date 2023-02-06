const mongoose = require('mongoose')
const dbUrl = 'mongodb://127.0.0.1:27017/simple-twitter'

mongoose.connect(dbUrl, {
    useNewUrlParser: true
})

module.exports = dbUrl;