require("dotenv").config();
const { DB_USER, DB_PASSWORD, DB_CONN_STRING } = process.env;

const oracledb = require("oracledb");

let connection = null;
async function connect() {
  try {
    connection = await oracledb.getConnection({
      user: DB_USER,
      password: DB_PASSWORD,
      tns: DB_CONN_STRING,
    });

    console.log("Connection Succeeded");

    return connection;
  } catch (error) {
    console.error({ error });
    console.trace(error.message);
  }
  //  finally {
  //   try {
  //     await connection.close();
  //   } catch (error) {
  //     console.error("Error in closing connection", error);
  //   }
  // }
}

module.exports = connect;
