const oracledb = require("oracledb");

function logErr(error) {
  console.error(error.message);
  // console.trace(error);
  throw new Error();
}

function paramIsRequired(param) {
  throw new Error(`${param} - Parameter is required`);
}

async function getConnectionFromPool(pool) {
  const myPool = oracledb.getPool(pool);
  return await myPool.getConnection();
}

function bindByPosition(data = [], query = "") {
  for (let i = 0; i < data.length; i++) query += i > 0 ? ", :" + i : ":" + i;
  query += ")";
  return query;
}

function bindByName(data = {}, query) {
  const keys = Object.keys(data);
  for (let i = 0; i < keys.length; i++)
    query += i > 0 ? ", :" + keys[i] : ":" + keys[i];
  query += ")";
  return query;
}

// NOT in use
function convertObj(obj, separator) {
  let str = "";
  const entries = Object.entries(obj);
  const len = entries.length;
  for (let i = 0; i < len; i++) {
    const [key, val] = entries[i];
    str += `${key} = ${val}${i !== len - 1 ? ` ${separator} ` : ""}`;
  }
  return str;
}

function strBuilder(filter, separator = "AND") {
  let query = "";
  let count = 1;
  let varIn, varGt, varGte, varLt, varLte;
  for (const key in filter) {
    const col = filter[key];
    // console.log(key, col);

    if (count > 1) query += ` ${separator} `;

    if (col.$in) {
      varIn = col.$in;
      query += `${key} IN ( ${varIn} )`;
      ++count;
    } else if (col.$gt || col.$gte) {
      varGt = col.$gt;
      varGte = col.$gte;
      query += `${key} ${varGt ? `> ${varGt}` : `>= ${varGte}`} `;
      ++count;
    } else if (col.$lt || col.$lte) {
      varLt = col.$lt;
      varLte = col.$lte;
      query += `${key} ${varLt ? `< ${varLt}` : `<= ${varLte}`} `;
      ++count;
    } else {
      query += `${key} = ${filter[key]}`;
      ++count;
    }
  }
  // console.log(query);
  return `${query}`;
}

module.exports = {
  logErr,
  paramIsRequired,
  getConnectionFromPool,
  bindByPosition,
  bindByName,
  convertObj,
  strBuilder,
};
