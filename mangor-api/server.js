const express = require('express')

const {ROUTES} = require("./src/middlewares/routes/routes");
const {setupRateLimit} = require("./src/middlewares/ratelimit");
const {setupLogging} = require("./src/middlewares/logging");
const {setupProxies} = require("./src/middlewares/proxy");
const app = express()
const port = 3005;


setupLogging(app);
setupProxies(app, ROUTES);
setupRateLimit(app, ROUTES);
app.disable('x-powered-by')
app.listen(port, () => {
    console.log(`API-Gateway app listening at http://localhost:${port}`)
})