const mongoose = require('mongoose');

const memeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    author: String,
    image: String,
    votes: Number
 
});

module.exports = mongoose.model('Meme', memeSchema);