const express = require("express");
const { getSomeImages } = require('../controllers/images');
const router = express.Router();
const uploadController = require("../controllers/upload");
const upload = require("../middleware/upload");

let routes = (app) => {

  router.get("/some", function (req, res) {
    const limit = parseInt(req.query.limit) || 0;
    const dimension = req.query.dimension || 'preview'
    const offset = parseInt(req.query.offset) || 0;
    const rfilteringOptions = req.query.filteringOptions || {}

    const filteringOptions = {...rfilteringOptions}/* JSON.parse(rfilteringOptions) */
    getSomeImages({limit, dimension, offset, filteringOptions}).then(images => {
      res.send(images);
    })
  });
  /* router.post("/upload", function (req, res) {
    res.send('hello');
  }); */
  // router.get("/", function (req, res) {
    
  //   getSomeImages(3).then(result => {
  //     res.send(result);
  //   })
  // });

  router.post("/upload", upload.single("file"), uploadController.uploadFiles);

  return app.use("/photos", router);
};

module.exports = routes;