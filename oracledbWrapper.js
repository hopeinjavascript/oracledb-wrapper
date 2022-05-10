const oracledb = require("oracledb");
// const connection = require("./oracledb");
const utils = require("./utils/utils");

let con;
exports.createTable = async (query) => {
  try {
    con = await utils.getConnectionFromPool("myPool");
    return await con.execute(query);
  } catch (error) {
    utils.logErr(error);
  } finally {
    if (con) {
      try {
        await con.close();
        console.log("conn closed");
      } catch (error) {
        console.error("Error while closing connection", error);
      }
    }
  }
};

exports.findById = async (tableName, id, options) => {
  try {
    const query = `
    SELECT *
    FROM ${tableName}
    WHERE Id = :id`;
    const opts = {
      maxRows: 1,
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      ...options,
    };
    con = await utils.getConnectionFromPool("myPool");
    return await con.execute(query, [id], opts);
  } catch (error) {
    utils.logErr(error);
  } finally {
    if (con) {
      try {
        await con.close();
        console.log("conn closed");
      } catch (error) {
        console.error("Error while closing connection", error);
      }
    }
  }
};

exports.findByIdAndUpdate = async (tableName, id, dataToUpdate, options) => {
  if (Object.keys(dataToUpdate).length === 0)
    return "dataToUpdate = {} cannot be empty";

  try {
    const query = `
    UPDATE ${tableName}
    SET ${utils.strBuilder(dataToUpdate, ",")}
    WHERE Id = :id`;

    const opts = {
      autoCommit: true,
      maxRows: 1,
      ...options,
    };
    console.log(query, "\n");

    con = await utils.getConnectionFromPool("myPool");
    return await con.execute(query, [id], opts);
  } catch (error) {
    utils.logErr(error);
  } finally {
    if (con) {
      try {
        await con.close();
        console.log("conn closed");
      } catch (error) {
        console.error("Error while closing connection", error);
      }
    }
  }
};

exports.findByIdAndDelete = async (tableName, id, options) => {
  try {
    const query = `
    DELETE
    FROM ${tableName}
    WHERE Id = :id`;

    const opts = {
      autoCommit: true,
      maxRows: 1,
      ...options,
    };

    con = await utils.getConnectionFromPool("myPool");
    return await con.execute(query, [id], opts);
  } catch (error) {
    utils.logErr(error);
  } finally {
    if (con) {
      try {
        await con.close();
        console.log("conn closed");
      } catch (error) {
        console.error("Error while closing connection", error);
      }
    }
  }
};

exports.insertOne = async (tableName, data, options) => {
  try {
    if (data.length === 0)
      return res.send("data: Array/Object param cannot be empty");

    let query = `INSERT INTO ${tableName} VALUES (`;

    if (Array.isArray(data)) {
      query = utils.bindByPosition(data, query);
    } else {
      query = utils.bindByName(data, query);
    }
    console.log(query);

    const opts = {
      autoCommit: true,
      ...options,
    };

    con = await utils.getConnectionFromPool("myPool");
    return await con.execute(query, data, opts);
  } catch (error) {
    utils.logErr(error);
  } finally {
    if (con) {
      try {
        await con.close();
        console.log("conn closed");
      } catch (error) {
        trBuilder;
        console.error("Error while closing connection", error);
      }
    }
  }
};

exports.insertMany = async (tableName, data = [], options) => {
  try {
    if (data.length === 0) return res.send("data[] param cannot be empty");

    let query = `INSERT INTO ${tableName} VALUES (`;

    if (Array.isArray(data[0])) query = utils.bindByPosition(data[0], query);
    else query = utils.bindByName(data[0], query);

    console.log(query);

    const opts = {
      autoCommit: true,
      batchErrors: true,
      dmlRowCount: true,
      ...options,
    };

    con = await utils.getConnectionFromPool("myPool");
    return await con.executeMany(query, data, opts);
  } catch (error) {
    utils.logErr(error);
  } finally {
    if (con) {
      try {
        await con.close();
        console.log("conn closed");
      } catch (error) {
        console.error("Error while closing connection", error);
      }
    }
  }
};

// this will give only one/first record even if there are multiple records
exports.findOne = async (tableName, filter, options) => {
  const len = Object.keys(filter).length;
  console.log({ len });
  try {
    const query = `
    SELECT * 
    FROM ${tableName}
    ${len > 0 ? `WHERE ${utils.strBuilder(filter)}` : ""}`;

    console.log(query);

    const opts = {
      maxRows: 1,
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      ...options,
    };
    con = await utils.getConnectionFromPool("myPool");
    return await con.execute(query, [], opts);
  } catch (error) {
    utils.logErr(error);
  } finally {
    if (con) {
      try {
        await con.close();
        console.log("conn closed");
      } catch (error) {
        console.error("Error while closing connection", error);
      }
    }
  }
};

exports.find = async (tableName, filter = {}, options) => {
  const len = Object.keys(filter).length;
  console.log({ len });
  try {
    const query = `
    SELECT *
    FROM ${tableName}
    ${len > 0 ? `WHERE ${utils.strBuilder(filter)}` : ""}`;

    console.log(query);

    const opts = {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      ...options,
    };
    con = await utils.getConnectionFromPool("myPool");
    return await con.execute(query, [], opts);
  } catch (error) {
    utils.logErr(error);
  } finally {
    if (con) {
      try {
        await con.close();
        console.log("conn closed");
      } catch (error) {
        console.error("Error while closing connection", error);
      }
    }
  }
};

exports.findStream = async (tableName, filter = {}, options) => {
  const len = Object.keys(filter).length;
  console.log({ len });
  try {
    const query = `
    SELECT *
    FROM ${tableName}
    ${len > 0 ? `WHERE ${utils.strBuilder(filter)}` : ""}
    `;
    console.log(query);
    const opts = {
      prefetchRows: 100,
      fetchArraySize: 100,
    };
    con = await utils.getConnectionFromPool("myPool");
    const stream = con.queryStream(query, [], opts);

    const strm = new Promise((resolve, reject) => {
      let rowCount = 0;
      let data = [];

      stream.on("error", (err) => {
        console.error("error in stream", err);
        reject(err);
      });

      stream.on("data", (row) => {
        console.log("stream data :: ", row);
        data.push(row);
        rowCount++;
      });

      stream.on("end", () => {
        console.log("stream end");
        stream.destroy();
      });

      stream.on("close", () => {
        console.log("stream closed", rowCount);
        resolve(data);
      });
    });

    const data = await strm;
    // console.log("Rows selected: " + data);
    return data;
  } catch (error) {
    utils.logErr(error);
  } finally {
    if (con) {
      try {
        await con.close();
        console.log("conn closed");
      } catch (error) {
        console.error("Error while closing connection", error);
      }
    }
  }
};

exports.update = async (tableName, dataToUpdate, filter, options) => {
  if (
    Object.keys(dataToUpdate).length === 0 &&
    Object.keys(filter).length === 0
  )
    return "dataToUpdate: Object and filter: Object cannot be empty";

  try {
    const query = `
    UPDATE ${tableName}
    SET ${utils.strBuilder(dataToUpdate, ",")}
    WHERE ${utils.strBuilder(filter)}`;
    const opts = {
      maxRows: 1,
      autoCommit: true,
      ...options,
    };
    console.log(query, "\n");

    con = await utils.getConnectionFromPool("myPool");
    return await con.execute(query, [], opts);
  } catch (error) {
    utils.logErr(error);
  } finally {
    if (con) {
      try {
        await con.close();
        console.log("conn closed");
      } catch (error) {
        console.error("Error while closing connection", error);
      }
    }
  }
};

exports.delete = async (tableName, filter, options) => {
  if (!tableName || Object.keys(filter).length === 0)
    return "tableName: string and filter: Object cannot be empty";

  try {
    const query = `
    DELETE
    FROM ${tableName}
    WHERE ${utils.strBuilder(filter)}`;
    const opts = {
      maxRows: 1,
      autoCommit: true,
      ...options,
    };
    console.log(query, "\n");
    con = await utils.getConnectionFromPool("myPool");
    return await con.execute(query, [], opts);
  } catch (error) {
    utils.logErr(error);
  } finally {
    if (con) {
      try {
        await con.close();
        console.log("conn closed");
      } catch (error) {
        console.error("Error while closing connection", error);
      }
    }
  }
};
