const createError = require('http-errors');
const { Request } = require("tedious");
const { modelUser } = require("../models/users.js")
const connection = require("../database/connection");

module.exports.getUser = (userId, next) => {

  const request = new Request(
    `SELECT *
     FROM [dbo].[Utilizator] 
     WHERE id = '${userId}'`,
    (err, rowCount) => {
      if (err) {
        next(createError(500, err.message));
      } else {
        console.log(`${rowCount} row(s) returned`);
      }
    }
  );

  var users = []
  request.on("row", columns => {
    var user = modelUser(columns);
    users.push(user)
  });

  request.on("err", err => {
    next(createError(500, err.message));
  });

  request.on('doneProc', (rowCount, more, rows) => { 
    next(undefined, users);
  });

  connection.execSql(request);
}