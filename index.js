const express = require('express');
const memeRoute = require('./routes/memes');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");

const port = process.env.PORT || 5000;
const app = express();
mongoose.connect("mongodb+srv://joha:oymoma@cluster0.qfjk5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");          

app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/memes", memeRoute);

app.listen(port, () => {
    console.log(`Server started on port: ${port}`);    
});

module.exports = app;