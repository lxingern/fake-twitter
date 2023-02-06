const mongoose = require('mongoose')
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/simple-twitter'

mongoose.connect(dbUrl, {
    useNewUrlParser: true
})

module.exports = dbUrl;