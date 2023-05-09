const http = require("http");
const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

function openConnection() {
  return mysql.createConnection(dbConfig);
}

async function createTable(connection) {
  try {
    const [result] = await connection.execute(
      `CREATE TABLE IF NOT EXISTS platforminfo (
        uid INT(10) NOT NULL AUTO_INCREMENT,
        username VARCHAR(64) NULL DEFAULT NULL,
        departname VARCHAR(128) NULL DEFAULT NULL,
        created DATE NULL DEFAULT NULL,
        PRIMARY KEY (uid)
      ) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;`
    );
    console.log("createTable result:", result);
  } catch (err) {
    console.error("createTable error:", err);
  }
}

async function insertData(connection) {
  try {
    const [result] = await connection.execute(
      "INSERT INTO platforminfo (username, departname, created) VALUES ('platform', 'Deploy Friday', '2019-06-17')"
    );
    console.log("insertData result:", result);
  } catch (err) {
    console.error("insertData error:", err);
  }
}

async function readData(connection) {
  try {
    const [rows] = await connection.query("SELECT * FROM platforminfo");
    console.log("readData rows:", rows);
    return rows;
  } catch (err) {
    console.error("readData error:", err);
    return [];
  }
}

async function dropTable(connection) {
  try {
    const [result] = await connection.execute("DROP TABLE platforminfo");
    console.log("dropTable result:", result);
  } catch (err) {
    console.error("dropTable error:", err);
  }
}

const server = http.createServer(async function(request, response) {
  if (request.url === '/') {
    // Connect to MariaDB.
    const connection = await openConnection();
    await createTable(connection);
    await insertData(connection);
    const rows = await readData(connection);
    await dropTable(connection);

    // Make the output.
    const outputObj = {
      message: "Hello, World! - A simple Node.js template",
      mariaDbTests: {
        connectAndAddRow: rows.length > 0 ? rows[0] : null,
        deleteRow: true,
      },
    };
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(outputObj));
  } else if (request.url === '/ping') {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("PONG");
  } else {
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.end("404 Not Found");
  }
});

// Get PORT and start the server
const port = 3000;
server.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
