const express = require('express');
const memeRoute = require('./routes/memes');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
require('dotenv').config();

const port = process.env.PORT || 5000;
const app = express();
const connection_uri = process.env.CONNECTION_URI;
mongoose.connect(connection_uri);          

app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/memes", memeRoute);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);    
});

module.exports = app;