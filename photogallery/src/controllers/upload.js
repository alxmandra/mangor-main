const fs = require("fs");
const pako = require('pako');
const sharp = require("sharp");

const db = require("../models");
const Image = db.images;

async function resizeImage(fileName, width, height) {
  try {
    return await sharp(fileName)
      .resize({
        width,
        height
      })
      .toFormat("jpeg", { mozjpeg: true })
      .toBuffer()
  } catch (error) {
    console.log(error);
  }
}

const uploadFiles = async (req, res) => {
  try {

    if (req.file == undefined) {
      return res.send(`You must select a file.`);
    }
const preview = await resizeImage(__basedir + "/public/img/" + req.file.filename, 1280, 320)
const compressed = await resizeImage(__basedir + "/public/img/" + req.file.filename, 150, 97)
const file = fs.readFileSync(
  __basedir + "/public/img/" + req.file.filename
)
    Image.create({
      author: req.body.author_id,
      title: req.body.title,
      description: req.body.description,
      type: req.file.mimetype,
      name: req.file.originalname,
      data: file,
      preview,
      compressed
    }).then((image) => {
      fs.writeFileSync(
        __basedir + "/public/img/tmp/" + image.name,
        image.data
      );

      return res.send(`File has been uploaded.`);
    });
  } catch (error) {
    console.log(error);
    return res.send(`Error when trying upload images: ${error}`);
  }
};

module.exports = {
  uploadFiles,
};