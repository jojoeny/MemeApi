const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const multer = require('multer');
const Meme = require('../models/meme');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
} 

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

router.get('/', (req, res) => {
    Meme.find().exec()
    .then(docs => {
       // console.log(docs);
        res.json({docs});
    })
    .catch(err => {
        console.log(err); 
    });

});

router.post("/", upload.single('memeImage'), (req, res, next) => {
    const meme = new Meme({
      _id: new mongoose.Types.ObjectId(),
      title: req.body.title,
      author: req.body.author,
      image: req.file.path,
      votes: req.body.votes
    });
    meme
      .save()
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "Handling POST requests",
          createdMeme: result
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

  router.get("/:memeid", (req, res, next) => {
      const id = req.params.memeid;
      Meme.findById(id)
      .exec()
      .then(doc => {
        res.status(200).json({doc})
      })
      .catch(err => {
          console.log(err);
      });
  });


module.exports = router;