const oracledb = require("oracledb");

process.env.UV_THREADPOOL_SIZE = require("os").cpus().length - 1;

// console.log(process.env.UV_THREADPOOL_SIZE);

require("dotenv").config();
const { DB_USER, DB_PASSWORD, DB_CONN_STRING } = process.env;

async function createPool() {
  try {
    await oracledb.createPool({
      user: DB_USER,
      password: DB_PASSWORD,
      tns: DB_CONN_STRING,
      poolIncrement: 0,
      poolMax: 4,
      poolMin: 4,
      poolAlias: "myPool",
      poolTimeout: 120, //seconds
    });

    // myPool = oracledb.getPool("myPool");
    // return myPool.getConnection();
  } catch (error) {
    console.log("createPool() error", error);
  }
}

module.exports = createPool;
