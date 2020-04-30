const { Connection } = require("tedious");
const config = require("./config");

const connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on("connect", err => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Database connected.");
  }
});

module.exports = connection;