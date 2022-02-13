const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const multer = require('multer');
const Meme = require('../models/meme');
const Jimp = require("jimp");
const Path = require('path');

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
    fileFilter: fileFilter,
    limits: {
      fileSize: 1024 * 1024 * 5
    }
});

//get all memes
router.get('/all', (req, res) => {
    Meme.find().exec()
    .then(docs => {
       res.json({docs});
    })
    .catch(err => {
        console.log(err); 
    });

});

//send a meme template with texts to display
router.get("/", upload.single('memeImage'), async (req, res) => {

  const pathToFile = await textOverlay(req.file.path, req.body.text_top, req.body.text_bottom);
  console.log(req.file)

    const meme = new Meme({
      _id: new mongoose.Types.ObjectId(),
      title: req.body.title,
      author: req.body.author,
      image: req.file.path,
      text_top: req.body.text_top,
      text_bottom: req.body.text_bottom      
    });
    meme
      .save()
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });      
      res.sendFile(pathToFile, { root: './' });
  });

  async function textOverlay(path, textTop, textBottom) {
    
    // Reading image
    const image = await Jimp.read(path.toString()); 
    const savePath = 'uploads/' + `new${Path.basename(path.toString())}`;
    
    // Defining the text font
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

    const x = image.bitmap.width;
    const y = image.bitmap.height;
 
    var textWidthTop = Jimp.measureText(font, textTop);
    var textHightTop = Jimp.measureTextHeight(font, textTop);
 
    var textWidthBottom = Jimp.measureText(font, textBottom);
    var textHightBottom = Jimp.measureTextHeight(font, textBottom);
 
    image.print(font, x/2.5, y/100, {
        text: textTop,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_TOP              
    }, textWidthTop, textHightTop);
 
    image.print(font, x/2.5, y, {
     text: textBottom,
     alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
     alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM
 }, textWidthBottom, textHightBottom);

    // Writing image after processing
     await image.writeAsync(savePath);

        return savePath;
 }

 //get meme by memeid
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
