const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
global.config = require("config");
const { router } = require("./Routes/Router");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(router);

//App listens to port 8080 by default
app.listen(process.env.PORT || config.app.port, (err) => {
  if (err) console.log("Encountered an error", err);
  else console.log("Listening on port " + config.app.port);
});
