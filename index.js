const express = require("express");
const app = express();
app.use(express.json());

const logger = require("./logger");
const connect = require("./oracledb");
app.use(logger);

const router = require("./router");
app.use(router);

// const connection = require("./oracledb");
const createPool = require("./oracledb1");
createPool().then(() => {
  app.listen(5000, () => console.log("Server is running on PORT 5000"));
});
// connection().then(() => {
// });
