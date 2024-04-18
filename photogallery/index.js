const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./src/models");
const bodyParser = require('body-parser');
const initRoutes = require("./src/routes/web");
const compression = require('compression')

global.__basedir = __dirname;
app.use(cors());
app.use(compression());
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));

initRoutes(app);

db.sequelize.sync();
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

let port = 3004;
app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});