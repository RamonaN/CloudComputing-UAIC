const createError = require('http-errors');
const { Request } = require("tedious");
const { modelUser } = require("../models/users")
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

  request.on('requestCompleted', () => { 
    next(undefined, users);
  });

  connection.execSql(request);
}

exists = (userName, success, failure) => {
  const request = new Request(
    `SELECT 1
     FROM [dbo].[Utilizator] 
     WHERE nume = '${userName}'`,
    (err, rowCount) => {
      if (err) {
        success(createError(500, err.message));
      } else {
        console.log(`${rowCount} row(s) returned`);
      }
    }
  );

  var exists = false;
  request.on("row", columns => {
    exists = true;
  });

  request.on("err", err => {
    console.log(err.message);
  });

  request.on('requestCompleted', () => { 
    if (exists)
      success();
    else
      failure();
  });

  connection.execSql(request);
}

module.exports.exists = exists;

module.exports.register = (userName) => {
  this.exists(userName, () => {return;}, () => {
    const request = new Request(
      `INSERT INTO [dbo].[Utilizator] (id, nume)
       VALUES ((SELECT ISNULL(MAX(id) + 1, 1) FROM Utilizator), '${userName}');`,
      (err, rowCount) => {
        if (err) {
          console.log(err.message);
        } else {
          console.log(`${rowCount} row(s) returned`);
        }
      }
    );

    request.on("err", err => {
      console.log(err.message);
    });

    connection.execSql(request);
  });
}

module.exports.getId = (userName, callback) => {
  const request = new Request(
    `SELECT id
     FROM [dbo].[Utilizator]
     WHERE nume = '${userName}'`,
    (err, rowCount) => {
      if (err) {
        callback(err, undefined);
      } else {
        console.log(`${rowCount} row(s) returned`);
      }
    }
  );

  request.on("err", err => {
    console.log(err.message);
  });

  var id = -1;
  request.on("row", columns => {
    id = columns[0].value;
  });

  request.on('requestCompleted', () => { 
    callback(undefined, id);
  });

  connection.execSql(request);
}