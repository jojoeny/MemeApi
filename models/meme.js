const mongoose = require('mongoose');

const memeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    author: String,
    image: String,
    text_top: String,
    text_bottom: String 
});

module.exports = mongoose.model('Meme', memeSchema);
