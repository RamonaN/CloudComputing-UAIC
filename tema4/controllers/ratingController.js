const createError = require('http-errors');
const { Request } = require("tedious");
const { modelRating } = require("../models/ratings")
const connection = require("../database/connection");

module.exports.getRatingsByUser = (userId, next) => {

  const request = new Request(
    `SELECT *
     FROM [dbo].[Scor] 
     WHERE utilizator = '${userId}'`,
    (err, rowCount) => {
      if (err) {
        next(createError(500, err.message));
      } else {
        console.log(`${rowCount} row(s) returned`);
      }
    }
  );

  var ratings = []
  request.on("row", columns => {
    var rating = modelRating(columns);
    ratings.push(rating)
  });

  request.on("err", err => {
    next(createError(500, err.message));
  });

  request.on('doneProc', (rowCount, more, rows) => { 
    next(undefined, ratings);
  });

  connection.execSql(request);
}

module.exports.getRatingsByBook = (bookId, next) => {

  const request = new Request(
    `SELECT *
     FROM [dbo].[Scor] 
     WHERE isbn = '${bookId}'`,
    (err, rowCount) => {
      if (err) {
        next(createError(500, err.message));
      } else {
        console.log(`${rowCount} row(s) returned`);
      }
    }
  );

  var ratings = []
  request.on("row", columns => {
    var rating = modelRating(columns);
    ratings.push(rating)
  });

  request.on("err", err => {
    next(createError(500, err.message));
  });

  request.on('doneProc', (rowCount, more, rows) => { 
    next(undefined, ratings);
  });

  connection.execSql(request);
}